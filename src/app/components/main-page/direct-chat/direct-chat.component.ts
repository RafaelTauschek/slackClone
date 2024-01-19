import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DirectChatChatareaComponent } from '../../chats/direct-chat-chatarea/direct-chat-chatarea.component';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../../services/shared.service';
import { Chat } from '../../../models/chat.class';
import { UserDataService } from '../../../services/data.service';


@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, DirectChatChatareaComponent, FormsModule],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss'
})
export class DirectChatComponent {
  message: string = '';
  chat: Chat[] = [];
  selectedFileName: string = '';
  selectedFile: File | null = null;

  constructor(public sharedService: SharedService, public data: UserDataService) {}

  
  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.selectedFileName = this.selectedFile?.name ?? '';
    }
  }

  async addMessageToChat() {
    if (this.message !== '') {
      const currentUserId = this.data.activeUser[0].id;
      const chatPartnerId = this.sharedService.currentPartner;
      const chatExits = this.data.checkIfChatExists(currentUserId, chatPartnerId);
      console.log(chatExits);
      if (!chatExits) {
        console.log('Chat does not exist, generating new chat');
        await this.data.generateNewChat(currentUserId, chatPartnerId, this.message);
        this.message = '';
      } else {
        this.message = '';
      }
    }
  }
}
