import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ChannelService } from '../../../services/channel.service';
import { Channel } from '../../../models/channel.class';
import { User } from '../../../models/user.class';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../../services/search.service';
import { SharedService } from '../../../services/shared.service';
import { MessageService } from '../../../services/message.service';


@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent implements OnDestroy {
  users: User[] = [];
  channels: Channel[] = [];
  usersSubscription: Subscription;
  channelsSubscription: Subscription;
  searchTerm: string = '';
  searchActive: boolean = false;
  searchType: string = '';
  searchedChannels: Channel[] = [];
  searchedUsers: User[] = [];
  searchedEmails: User[] = [];
  searchResult: any;
  newMessage: string = '';



  constructor(private userService: UserService, private channelService: ChannelService, private searchService: SearchService,
    private sharedService: SharedService, private messageService: MessageService) {
    this.usersSubscription = this.userService.usersObservable$.subscribe((users) => {
      this.users = users;
    });
    this.channelsSubscription = this.channelService.channelsSubscription$.subscribe((channels) => {
      this.channels = channels;
    });
  }


  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
    this.channelsSubscription.unsubscribe();
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
        this.searchedChannels = this.searchService.filterChannels(this.channels, this.searchTerm.slice(1));
        break;
      case '@':
        this.searchType = 'user';
        this.searchedUsers = this.searchService.filterUsers(this.users, this.searchTerm.slice(1));
        break;
      default:
        this.searchType = 'email';
        this.searchedEmails = this.searchService.filterUsersByMail(this.users, this.searchTerm);
        break;
    }
  }


  setChannel(channel: Channel) {
    this.searchTerm = '';
    this.searchActive = false;
    this.searchResult = channel.name;
    this.channelService.currentChannelId = channel.id;
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
        await this.messageService.sendChannelMessage(this.newMessage);
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
    const chatExits = this.messageService.checkIfChatExists(this.userService.activeUser.value[0].id, this.sharedService.currentPartner);
    if (!chatExits) {
      await this.messageService.generateNewChat(this.userService.activeUser.value[0].id, this.sharedService.currentPartner, this.newMessage);
    } else {
      await this.messageService.addMessageToChat(chatExits.chatId, this.newMessage, this.sharedService.currentPartner);
    }
  }
}
