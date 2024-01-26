import { Component } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../../services/data.service';
import { FormsModule } from '@angular/forms';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Emoji } from '../../../models/emoji.class';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { Message } from '../../../models/message.class';
@Component({
  selector: 'app-thread-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, EmojiModule, PickerComponent],
  templateUrl: './thread-chat.component.html',
  styleUrl: './thread-chat.component.scss'
})
export class ThreadChatComponent {
  editMenu: boolean = false;
  edit: boolean = false;
  messageContent: string = '';
  showEmojiPicker = false;

  constructor(public sharedService: SharedService, public data: UserDataService) {

  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  toggleEditMenu(message: any) {
    this.editMenu = !this.editMenu;
    message.editMessage = true;
  }

  addEmoji(event: any, message: Message) {
    const existingEmoji = message.emojis.find(
      (e: Emoji) => e.emoji === event.emoji.native
    );
    if (existingEmoji) {
      const senderIndex = existingEmoji.senders.indexOf(this.data.activeUser[0].id);
      if (senderIndex !== -1) {
        existingEmoji.senders.splice(senderIndex, 1);
        existingEmoji.count--;
        if (existingEmoji.count === 0) {
          const emojiIndex = message.emojis.indexOf(existingEmoji);
          message.emojis.splice(emojiIndex, 1);
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
      message.emojis.push(emoji.toJSON() as Emoji);
    }
    this.showEmojiPicker = !this.showEmojiPicker;
    this.data.editThreadMessage(this.data.message[0], message, message.content);
  }


  addReaction(emoji: any, message: Message) {
    const nativeEmoji = emoji.native;
    const existingEmoji = message.emojis.find(
      (e: Emoji) => e.emoji === nativeEmoji
    );
    if (existingEmoji) {
      const senderIndex = existingEmoji.senders.indexOf(this.data.activeUser[0].id);
      if (senderIndex !== -1) {
        existingEmoji.senders.splice(senderIndex, 1);
        existingEmoji.count--;
        if (existingEmoji.count === 0) {
          const emojiIndex = message.emojis.indexOf(existingEmoji);
          message.emojis.splice(emojiIndex, 1);
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
      message.emojis.push(emoji.toJSON() as Emoji);
    }
    this.data.editThreadMessage(this.data.message[0], message, message.content);
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
    this.data.editThreadMessage(this.data.message, message, this.messageContent);
  }





}
