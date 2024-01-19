import { Component } from '@angular/core';
import { Channel } from '../../../models/channel.class';
import { Message } from '../../../models/message.class';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../services/shared.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../../../services/data.service';


@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [CommonModule, PickerComponent, FormsModule],
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.scss'
})
export class ChatAreaComponent {
  channel: Channel[] = [];
  messages: Message[] = [];
  formatedMessages: { [key: string]: Message[] } = {};
  showEmojiPicker = false;
  isEditing: boolean = false;
  messageContent: string = '';

  constructor( 
     public sharedService: SharedService, 
    public sanitizer: DomSanitizer, public data: UserDataService) {
  }

  toggleEmojiPicker(message: any) {
    console.log('toggleEmojiPicker');
    console.log(message);
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    console.log(event);
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  openThread(message: any) {
    this.data.setCurrentMessage(message);
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
  }

  editMessage(message: any) {
    message.editMessage = false;
    this.isEditing = true;
  }

}
