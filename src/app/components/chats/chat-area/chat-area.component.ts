import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Component, ViewChild, ElementRef, AfterViewChecked,  } from '@angular/core';
import { Channel } from '../../../models/channel.class';
import { Message } from '../../../models/message.class';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../services/shared.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../../../services/data.service';
import { Emoji } from '../../../models/emoji.class';


@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [CommonModule, PickerComponent, FormsModule, EmojiModule],
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.scss'
})
export class ChatAreaComponent implements AfterViewChecked{
  channel: Channel[] = [];
  messages: Message[] = [];
  showEmojiPicker = false;
  isEditing: boolean = false;
  messageContent: string = '';
  editMenuOpend: boolean = false;
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor( public sharedService: SharedService, public sanitizer: DomSanitizer, public data: UserDataService) {}



  toggleEmojiPicker(message: any) {
    this.data.setCurrentMessage([message]);
    this.showEmojiPicker = !this.showEmojiPicker;
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
    this.data.editMessage(this.data.message[0], 'channel');
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
    this.data.editMessage(this.data.message[0], 'channel'); 
  }


  openThread(message: any) {
    this.data.setCurrentMessage([message]);
    console.log(this.data.message[0]);
    if (this.sharedService.isMobile) {
      this.sharedService.activeComponent = 'thread';
    }

    if (this.sharedService.isTablet) {
      this.sharedService.channelChatActive = false;
    }
    this.sharedService.threadActive = true;
    this.sharedService.changeWidth = 'calc(100% - 108px)';
  }


  openEditMenu(message: any) {
    message.editMessage = true;
    this.editMenuOpend = true;
  }


  editMessage(message: any) {
    this.messageContent = message.content;
    this.editMenuOpend = false;
    this.isEditing = true;
  }


  cancelEditing(message: any) {
    this.isEditing = false;
    message.editMessage = false;
  }


  saveChanges(message: any) {
    this.isEditing = false;
    message.editMessage = false;
    this.data.editChannelMessage(message, this.messageContent);
    this.scrollToBottom();
  }



  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } catch(err) { }
  }

}

