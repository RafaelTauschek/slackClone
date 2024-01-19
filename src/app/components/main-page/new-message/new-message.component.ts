import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Channel } from '../../../models/channel.class';
import { User } from '../../../models/user.class';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../../services/shared.service';
import { UserDataService } from '../../../services/data.service';


@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent {
  users: User[] = [];
  channels: Channel[] = [];
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


  constructor(private sharedService: SharedService, public data: UserDataService) {
  }



  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.selectedFileName = this.selectedFile?.name ?? '';
      this.newMessage += '\n' + this.selectedFileName;
    }
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
        this.searchedChannels = this.sharedService.filterChannels(this.channels, this.searchTerm.slice(1));
        break;
      case '@':
        this.searchType = 'user';
        this.searchedUsers = this.sharedService.filterUsers(this.users, this.searchTerm.slice(1));
        break;
      default:
        this.searchType = 'email';
        this.searchedEmails = this.sharedService.filterUsersByMail(this.users, this.searchTerm);
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
        await this.data.sendChannelMessage(this.newMessage, this.selectedFile);
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
    const chatExits = this.data.checkIfChatExists(this.data.activeUser[0].id, this.sharedService.currentPartner);
    if (!chatExits) {
      await this.data.generateNewChat(this.data.activeUser[0].id, this.sharedService.currentPartner, this.newMessage);
    } else {
     // await this.data.addMessageToChat(chatExits, this.newMessage, this.sharedService.currentPartner);
    }
  }
}
