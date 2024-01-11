import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Chat } from '../../../models/chat.class';
import { MessageService } from '../../../services/message.service';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-direct-chat-chatarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './direct-chat-chatarea.component.html',
  styleUrl: './direct-chat-chatarea.component.scss'
})
export class DirectChatChatareaComponent {
  user: any;
  userSubscription: Subscription;
  chatSubscription: Subscription;
  messagesAvailable: boolean = false;
  chat: Chat[] = [];

  constructor(public userService: UserService, private messageService: MessageService, public sharedService: SharedService) {
    this.userSubscription = this.userService.activeUserObservable$.subscribe((user) => {
      this.user = user;
    });
    this.chatSubscription = this.messageService.chatSubscription$.subscribe((chat) => {
      this.chat = chat;
      if (this.chat && this.chat.length > 0 && this.chat[0].messages) {
        this.messagesAvailable = true;  
      }
    });
  }
}
