import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Channel } from '../../../models/channel.class';
import { ChannelService } from '../../../services/channel.service';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
import { Message } from '../../../models/message.class';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../services/shared.service';


@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.scss'
})
export class ChatAreaComponent implements OnDestroy {
  channel: Channel[] = [];
  messages: Message[] = [];
  channelSubscription: Subscription;
  messageSubscription: Subscription;
  formatedMessages: { [key: string]: Message[] } = {};

  constructor(private channelService: ChannelService, private messageService: MessageService, public userService: UserService, public sharedService: SharedService) {
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


  openThread(message: any) {
    this.messageService.setCurrentMessage([message]);
      this.sharedService.threadActive = true;
  }



  ngOnDestroy(): void {
    this.channelSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
  }

}
