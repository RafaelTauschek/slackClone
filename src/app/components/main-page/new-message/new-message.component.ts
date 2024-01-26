import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Channel } from '../../../models/channel.class';
import { User } from '../../../models/user.class';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../../services/shared.service';
import { UserDataService } from '../../../services/data.service';
import { FirebaseService } from '../../../services/firebase.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';


@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [CommonModule, FormsModule, PickerComponent, EmojiModule],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent {
  searchTerm: string = '';
  searchActive: boolean = false;
  searchType: string = '';
  searchedChannels: Channel[] = [];
  searchedUsers: User[] = [];
  searchedEmails: User[] = [];
  searchResult: any;
  newMessage: string = '';
  selectedFileName: string = '';
  selectedFile: File | null = null;
  showEmojiPicker = false;



  constructor(private sharedService: SharedService, public data: UserDataService, private firebaseService: FirebaseService) {
  }



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
    this.newMessage += event.emoji.native;
    this.toggleEmojiPicker();
  }

  onSearch() {
    if (this.searchTerm === '') {
      this.searchActive = false;
      return;
    }
    this.searchActive = true;
    switch (this.searchTerm.charAt(0)) {
      case '#':
        this.searchType = 'channel';
        this.searchedChannels = this.sharedService.filterChannels(this.data.userChannels, this.searchTerm.slice(1));
        break;
      case '@':
        this.searchType = 'user';
        this.searchedUsers = this.sharedService.filterUsers(this.data.users, this.searchTerm.slice(1));
        break;
      default:
        this.searchType = 'email';
        this.searchedEmails = this.sharedService.filterUsersByMail(this.data.users, this.searchTerm);
        break;
    }
  }


  setChannel(channel: Channel) {
    this.searchTerm = '';
    this.searchActive = false;
    this.searchResult = channel.name;
  }


  setUser(user: User) {
    this.searchTerm = '';
    this.searchActive = false;
    this.searchResult = user.name;
    this.sharedService.currentPartner = user.id;
  }

  async sendMessage() {
    if (this.newMessage === '') {
      return;
    }
    switch (this.searchType) {
      case 'channel':
        await this.sharedService.sendChannelMessage(this.newMessage, this.selectedFile);
        this.newMessage = '';
        break;
      case 'user':
        await this.addMessageToChat();
        this.newMessage = '';
        break;
      case 'email':
        await this.addMessageToChat();
        this.newMessage = '';
        break;
    }
  }


  async addMessageToChat() {
    if (this.newMessage !== '' || this.selectedFile) {
      const newMessage = await this.generateNewMessage(this.selectedFile);
      const chatExists = this.data.checkIfChatExists(this.data.activeUser[0].id, this.sharedService.currentPartner);
      if (chatExists) {
        const chat = this.data.getChat(this.data.activeUser[0].id, this.sharedService.currentPartner);
        await this.data.writeChatMessage(newMessage, chat[0].id);
      } else {
        await this.data.generateNewChat(this.data.activeUser[0].id, this.sharedService.currentPartner, newMessage);
      }
    } 
    this.newMessage = '';
    this.selectedFile = null;
    this.selectedFileName = '';
  }


  async generateNewMessage(file: File | null) {
    let fileName = '';
    let fileUrl = '';
    if (file) {
      fileName = file.name;
      fileUrl = await this.firebaseService.uploadFile(file);
    }
    const message = this.data.generateNewMessage(this.newMessage, fileName, fileUrl);
    return message;
  }
}
