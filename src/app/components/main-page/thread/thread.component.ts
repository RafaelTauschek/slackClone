import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ThreadChatComponent } from '../../chats/thread-chat/thread-chat.component';
import { SharedService } from '../../../services/shared.service';
import { Channel } from '../../../models/channel.class';
import { FormsModule } from '@angular/forms';
import { Message } from '../../../models/message.class';
import { User } from '../../../models/user.class';
import { FirebaseService } from '../../../services/firebase.service';
import { UserDataService } from '../../../services/data.service';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, ThreadChatComponent, FormsModule],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  channel: Channel[] = [];
  answer: string = '';
  user: User[] = [];
  message: Message[] = [];  

  constructor(private sharedService: SharedService, private firebaseService: FirebaseService, public data: UserDataService) {}


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


