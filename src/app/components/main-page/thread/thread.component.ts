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
  answer: string = '';
  selectedFileName: string = '';
  selectedFile: File | null = null;


  constructor(private sharedService: SharedService, private firebaseService: FirebaseService, public data: UserDataService) {}


  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.selectedFileName = this.selectedFile?.name ?? '';
    }
  }
 

  async sendMessage() {
    if (this.answer !== '' || this.selectedFile) {
      await this.data.writeAnswerMessage(this.answer, this.selectedFile);
    } 
    this.answer = '';
    this.selectedFile = null;
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
}


