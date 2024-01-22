import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
export class ChatAreaComponent implements AfterViewChecked {
  channel: Channel[] = [];
  messages: Message[] = [];
  formatedMessages: { [key: string]: Message[] } = {};
  showEmojiPicker = false;
  isEditing: boolean = false;
  messageContent: string = '';
  editMenuOpend: boolean = false;
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

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
