import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../services/shared.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UserDataService } from '../../../services/data.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { FormsModule } from '@angular/forms';
import { Emoji } from '../../../models/emoji.class';
@Component({
  selector: 'app-direct-chat-chatarea',
  standalone: true,
  imports: [CommonModule, PickerComponent, EmojiModule, FormsModule],
  templateUrl: './direct-chat-chatarea.component.html',
  styleUrl: './direct-chat-chatarea.component.scss'
})
export class DirectChatChatareaComponent {
  editMenu: boolean = false;
  edit: boolean = false;
  messageContent: string = '';
  showEmojiPicker = false;


  constructor (public sharedService: SharedService, public sanitizer: DomSanitizer, public data: UserDataService) {}

  toggleEditMenu(message: any) {
      this.editMenu = !this.editMenu;
      message.editMessage = true;
  }



  editMessage(message: any) {
    this.messageContent = message.content;
    this.editMenu = !this.editMenu;
    this.edit = !this.edit;
  }

  cancelEditing(message: any) {
    this.edit = false;
    this.editMenu = false;
    message.editMessage = false;
  }

  saveChanges(message: any) {
    this.edit = false;
    this.editMenu = false;
    message.editMessage = false;
    this.data.editChatMessage(message, this.messageContent);
  }

  addEmoji(event: any) {
    const existingEmoji = this.data.message[0].emojis.find(
      (e: Emoji) => e.emoji === event.emoji.native
    );
    if (existingEmoji) {
      const senderIndex = existingEmoji.senders.indexOf(this.data.activeUser[0].id);
      if (senderIndex !== -1) {
        existingEmoji.senders.splice(senderIndex, 1);
        existingEmoji.count--;
        if (existingEmoji.count === 0) {
          const emojiIndex = this.data.message[0].emojis.indexOf(existingEmoji);
          this.data.message[0].emojis.splice(emojiIndex, 1);
        }
      } else {
        existingEmoji.senders.push(this.data.activeUser[0].id);
        existingEmoji.count++;
      }
    } else {
      const emoji = new Emoji({
        senders: [this.data.activeUser[0].id],
        emoji: event.emoji.native,
        count: 1,
      });
      this.data.message[0].emojis.push(emoji.toJSON());    
    }
    this.showEmojiPicker = !this.showEmojiPicker;
    this.data.editMessage(this.data.message[0], 'chat');
  }

  addReaction(emoji: any, message: any) {
    this.data.message = [message];
    const nativeEmoji = emoji.native;
    const existingEmoji = this.data.message[0].emojis.find(
      (e: Emoji) => e.emoji === nativeEmoji
    );
    if (existingEmoji) {
      const senderIndex = existingEmoji.senders.indexOf(this.data.activeUser[0].id);
      if (senderIndex !== -1) {
        existingEmoji.senders.splice(senderIndex, 1);
        existingEmoji.count--;
        if (existingEmoji.count === 0) {
          const emojiIndex = this.data.message[0].emojis.indexOf(existingEmoji);
          this.data.message[0].emojis.splice(emojiIndex, 1);
        }
      } else {
        existingEmoji.senders.push(this.data.activeUser[0].id);
        existingEmoji.count++;
      }
    } else {
      const emoji = new Emoji({
        senders: [this.data.activeUser[0].id],
        emoji: nativeEmoji,
        count: 1,
      });
      this.data.message[0].emojis.push(emoji.toJSON());
    } 
    this.data.editMessage(this.data.message[0], 'chat'); 
  }

  toggleEmojiPicker(message: any) {
    this.data.setCurrentMessage([message]);
    this.showEmojiPicker = !this.showEmojiPicker;
  }

}
