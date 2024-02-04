import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DirectChatChatareaComponent } from '../../chats/direct-chat-chatarea/direct-chat-chatarea.component';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../../services/shared.service';
import { Chat } from '../../../models/chat.class';
import { UserDataService } from '../../../services/data.service';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, DirectChatChatareaComponent, FormsModule, EmojiModule, PickerComponent],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss'
})
export class DirectChatComponent {
  message: string = '';
  chat: Chat[] = [];
  selectedFileName: string = '';
  selectedFile: File | null = null;
  showEmojiPicker = false;  

  constructor(public sharedService: SharedService, public data: UserDataService) {}

  
  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.selectedFileName = this.selectedFile?.name ?? '';
    }
  }

  toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    this.message += event.emoji.native;
    this.toggleEmojiPicker();
  }

  async sendMessage() {
    if (this.message !== '' || this.selectedFile) {
      const newMessage = await this.generateNewMessage(this.selectedFile);
      const chatExists = this.data.checkIfChatExists(this.data.activeUser[0].id, this.sharedService.currentPartner);
      if (chatExists) {
        console.log('Chat exists');
        await this.data.writeChatMessage(newMessage, this.data.currentChat[0].id);
      } else {
        console.log('Chat doesnt exsists, generating new one'); 
        await this.data.generateNewChat(this.data.activeUser[0].id, this.sharedService.currentPartner, newMessage);
      }
    } 
    this.message = '';
    this.selectedFile = null;
    this.selectedFileName = '';
  }



  async generateNewMessage(file: File | null) {
    let fileName = '';
    let fileUrl = '';
    if (file) {
      fileName = file.name;
      fileUrl = await this.data.uploadFile(file);
    }
    const message = this.data.generateNewMessage(this.message, fileName, fileUrl);
    return message;
  }


  

 

}
