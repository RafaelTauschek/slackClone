import { Component } from '@angular/core';
import { AddChannelDialogComponent } from '../../dialogs/add-channel-dialog/add-channel-dialog.component';
import { UserPofileDialogComponent } from '../../dialogs/user-pofile-dialog/user-pofile-dialog.component';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Channel } from '../../../models/channel.class';
import { SharedService } from '../../../services/shared.service';
import { Chat } from '../../../models/chat.class';
import { User } from '../../../models/user.class';
import { UserDataService } from '../../../services/data.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  channels: Channel[] = [];
  chats: Chat[] = [];
  user: User[] = [];
  showChannels: boolean = true;
  showDirectChats: boolean = true;  
  searchTerm: string = '';


  constructor(private dialog: MatDialog, public sharedService: SharedService, public data: UserDataService) {
  }

  selectChannel(channelId: string) {
    if (this.sharedService.isMobile) {
      this.sharedService.activeComponent = 'channel-chat';
    }
    this.data.setChannel(channelId);
    this.sharedService.messageActive = false;
    this.sharedService.directChatActive = false;
    this.sharedService.channelChatActive = true;
  }

  openDialog() {
    this.dialog.open(AddChannelDialogComponent, {});
  }


  openNewMessage() {
    if (this.sharedService.isMobile) {
      this.sharedService.activeComponent = 'new-message';
    } else {
      this.sharedService.channelChatActive = false;
      this.sharedService.directChatActive = false;
      this.sharedService.threadActive = false;
      this.sharedService.messageActive = true;
    }
    this.sharedService.changeWidth = 'calc(100% - 48px)';
  }

  async openDirectChat(chatpartnerId: string, chat: Chat) {
    
    this.sharedService.setCurrentChatPartnerId(chatpartnerId);
    this.data.setCurrentChat([chat]);
    if (this.sharedService.isMobile) {
      this.sharedService.activeComponent = 'direct-chat';
    } else {
      this.sharedService.channelChatActive = false;
      this.sharedService.messageActive = false;
      this.sharedService.threadActive = false;
      this.sharedService.directChatActive = true;
    }
    this.sharedService.changeWidth = 'calc(100% - 48px)';
  }

  toggleChannel() {
    this.showChannels = !this.showChannels;
  }

  toggleDirectChat() {
    this.showDirectChats = !this.showDirectChats;
  }

  searchActive: boolean = false;
  searchedChannel: Channel[] = [];
  searchedUser: User[] = [];


  onSearch() {
    if (this.searchTerm !== '') {
      this.searchActive = true;
      this.searchedChannel = this.sharedService.filterChannels(this.data.userChannels, this.searchTerm);
      this.searchedUser = this.sharedService.filterUsers(this.data.users, this.searchTerm);
    } else {
      this.searchActive = false;
    }
  }

  openChannel(channelId: string) {
    this.data.setChannel(channelId);

    if (this.sharedService.isMobile) {
      this.sharedService.activeComponent = 'channel-chat';
    }
    this.sharedService.messageActive = false;
    this.sharedService.directChatActive = false;
    this.sharedService.channelChatActive = true;
  }

  openUser(userId: string) {
    this.sharedService.setCurrentChatPartnerId(userId);
    this.dialog.open(UserPofileDialogComponent, {});
  }

}
