import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Channel } from '../../../models/channel.class';
import { ChannelService } from '../../../services/channel.service';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
import { Message } from '../../../models/message.class';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../services/shared.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [CommonModule, PickerComponent, FormsModule],
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.scss'
})
export class ChatAreaComponent implements OnDestroy {
  channel: Channel[] = [];
  messages: Message[] = [];
  channelSubscription: Subscription;
  messageSubscription: Subscription;
  formatedMessages: { [key: string]: Message[] } = {};
  showEmojiPicker = false;
  isEditing: boolean = false;
  messageContent: string = '';

  constructor(private channelService: ChannelService, private messageService: MessageService, 
    public userService: UserService, public sharedService: SharedService, public sanitizer: DomSanitizer) {
    this.channelSubscription = this.channelService.channelSubscription$.subscribe((channel) => {
      this.channel = channel;
    });
    this.messageSubscription = this.messageService.messageSubscription$.subscribe((messages) => {
      this.messages = messages;
      if (messages && messages.length > 0) {
        this.formatedMessages = this.sharedService.groupMessagesByDate(this.messages);
      }
    });
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
    this.messageService.setCurrentMessage([message]);
    if (this.sharedService.isMobile) {
      this.sharedService.activeComponent = 'thread';
    }

    if (this.sharedService.isTablet) {
      this.sharedService.channelChatActive = false;
    }
    this.sharedService.threadActive = true;
    this.sharedService.changeWidth = 'calc(100% - 108px)';
  }



  ngOnDestroy(): void {
    this.channelSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
  }


  openEditMenu(message: any) {
    message.editMessage = true;
  }

  editMessage(message: any) {
    message.editMessage = false;
    this.isEditing = true;
  }

}
