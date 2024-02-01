import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ThreadChatComponent } from '../../chats/thread-chat/thread-chat.component';
import { SharedService } from '../../../services/shared.service';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { UserDataService } from '../../../services/data.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Channel } from '../../../models/channel.class';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, ThreadChatComponent, FormsModule, PickerComponent, EmojiModule],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  answer: string = '';
  selectedFileName: string = '';
  selectedFile: File | null = null;
  showEmojiPicker: boolean = false;


  constructor(private sharedService: SharedService, private firebaseService: FirebaseService, public data: UserDataService) {}


  toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
  }


  addEmoji(event: any ) {
    this.answer += event.emoji.native;
    this.toggleEmojiPicker(); 
  } 


  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.selectedFileName = this.selectedFile?.name ?? '';
    }
  }
 

  async sendMessage() {
    if (this.answer !== '' || this.selectedFile) {
      try {
        let fileName = '';
        let fileUrl = '';
        if (this.selectedFile) {
          fileName = this.selectedFile.name;
          fileUrl = await this.data.uploadFile(this.selectedFile)
        }
        const messageIndex = this.findMessageIndex(this.data.message[0].timestamp, this.data.currentChannel);
        const message = this.data.generateNewMessage(this.answer, fileName, fileUrl);
        this.data.currentChannel.messages[messageIndex].answers.push(message.toJSON());
        await this.data.updateDocument('channels', this.data.currentChannel.id, this.data.currentChannel)
      } catch (e) {
        console.error(e);
      }
    }

    this.answer = '';
    this.selectedFile = null
  }



   findMessageIndex(timestamp: number, channel: Channel) {
     if (channel && timestamp) {
         const messageIndex = channel.messages.findIndex(message => message.timestamp === timestamp);
         return messageIndex;
     } else {
       return -1;
     }
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


