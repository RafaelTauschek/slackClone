import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DirectChatChatareaComponent } from '../../chats/direct-chat-chatarea/direct-chat-chatarea.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { MessageService } from '../../../services/message.service';
import { FirebaseService } from '../../../services/firebase.service';
import { SharedService } from '../../../services/shared.service';


@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, DirectChatChatareaComponent, FormsModule],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss'
})
export class DirectChatComponent {
  message: string = '';

  constructor(private userService: UserService, private messageService: MessageService, private firebaseService: FirebaseService, private sharedService: SharedService) {

  }


  /**
   * Tasks:
   * 
   * 1. Add a method to send a message to the current chat or create a new chat if there is no current chat
   * 2. Check if a Chat already exists between the two users
   * 3. Add a method to get the current chat id and push it into both chatpartner's chats array
   * 
   */





  async addMessageToChat() {
    const currentUserId = this.userService.activeUser.value[0].id;
    const chatPartnerId = this.sharedService.currentPartner;
    const chatExits = this.messageService.checkIfChatExists(currentUserId, chatPartnerId);
    if (chatExits == undefined) {
      this.messageService.generateNewChat(currentUserId, chatPartnerId, this.message);
    } else { 
      console.log('Chat exists');
    }
    
  }


}
