import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DirectChatChatareaComponent } from '../../chats/direct-chat-chatarea/direct-chat-chatarea.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { MessageService } from '../../../services/message.service';
import { FirebaseService } from '../../../services/firebase.service';
import { SharedService } from '../../../services/shared.service';
import { Subscription } from 'rxjs';
import { Chat } from '../../../models/chat.class';


@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, DirectChatChatareaComponent, FormsModule],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss'
})
export class DirectChatComponent {
  message: string = '';
  chatSubscription: Subscription;
  chat: Chat[] = [];
  selectedFileName: string = '';
  selectedFile: File | null = null;

  constructor(public userService: UserService, private messageService: MessageService, private firebaseService: FirebaseService, public sharedService: SharedService) {
    this.chatSubscription = this.messageService.chatSubscription$.subscribe((chat) => {
      this.chat = chat;
    });
  }

  
  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.selectedFileName = this.selectedFile?.name ?? '';
    }
  }

  async addMessageToChat() {
    if (this.message !== '') {
      const currentUserId = this.userService.activeUser.value[0].id;
      const chatPartnerId = this.sharedService.currentPartner;
      const chatExits = this.messageService.checkIfChatExists(currentUserId, chatPartnerId);
      console.log(chatExits);
      if (!chatExits) {
        console.log('Chat does not exist, generating new chat');
        await this.messageService.generateNewChat(currentUserId, chatPartnerId, this.message);
        this.message = '';
      } else {
        const chatId = chatExits.chatId;
        await this.messageService.addMessageToChat(chatId, this.message, chatPartnerId);
        this.message = '';
      }
    }
  }
}
