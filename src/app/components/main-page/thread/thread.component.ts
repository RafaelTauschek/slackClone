import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ThreadChatComponent } from '../../chats/thread-chat/thread-chat.component';
import { SharedService } from '../../../services/shared.service';
import { ChannelService } from '../../../services/channel.service';
import { Channel } from '../../../models/channel.class';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Message } from '../../../models/message.class';
import { UserService } from '../../../services/user.service';
import { MessageService } from '../../../services/message.service';
import { User } from '../../../models/user.class';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, ThreadChatComponent, FormsModule],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent implements OnDestroy {
  channel: Channel[] = [];
  channelSubscription: Subscription
  userSubscription: Subscription;
  messageSubscription: Subscription;
  answer: string = '';
  user: User[] = [];
  message: Message[] = [];  

  constructor(private sharedService: SharedService, private channelService: ChannelService, 
    private userService: UserService, private messageService: MessageService, private firebaseService: FirebaseService) {
      this.channelSubscription = this.channelService.channelSubscription$.subscribe((channel) => { 
        this.channel = channel;
      });
      this.userSubscription = this.userService.activeUserObservable$.subscribe((user) => {
        this.user = user;
      });
      this.messageSubscription = this.messageService.singleMessageSubscription$.subscribe((message) => {
        this.message = message;
      });

  }

  ngOnDestroy(): void {
    this.channelSubscription.unsubscribe();
  }

  closeThread() {
    if (this.sharedService.isMobile) {
      this.sharedService.activeComponent = 'sidebar';
    }
    if (this.sharedService.isTablet) {
      this.sharedService.channelChatActive = true;
    }
    this.sharedService.threadActive = false;
    this.sharedService.changeWidth = 'calc(100% - 48px)';
  }

  async sendMessage() {
    if (this.answer !== '') {
      const answer = new Message({
        senderId: this.user[0].id,
        recieverId: this.message[0].senderId,
        timestamp: new Date().getTime(),
        content: this.answer,
        emojis: [],
        answers: [],
        fileName: '',
        fileUrl: '',
        editMessage: false,
      });
      let index: number = this.findMessageIndex();
      this.channel[0].messages[index].answers.push(answer.toJSON());
      const channelInstance = new Channel(this.channel[0])
      const channelData = channelInstance.toJSON();
      await this.firebaseService.updateDocument('channels', this.channel[0].id, channelData);
      await this.channelService.updateChannel(this.channel[0].id);
      this.answer = '';
    }
  }


  findMessageIndex() {
    const timestampToFind = this.message[0].timestamp;
    const channelIndex = this.channel.findIndex((channel) => {
      return channel.messages.some((message) => {
        return message.timestamp === timestampToFind;
      });
    });
    if (channelIndex !== -1) {
      const messageIndex = this.channel[channelIndex].messages.findIndex((message) => {
        return message.timestamp === timestampToFind;
      });
      return messageIndex;
    } else {
      return -1;
    }
  }


}


