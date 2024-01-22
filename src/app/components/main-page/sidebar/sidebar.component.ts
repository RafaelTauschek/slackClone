import { Component } from '@angular/core';
import { AddChannelDialogComponent } from '../../dialogs/add-channel-dialog/add-channel-dialog.component';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Channel } from '../../../models/channel.class';
import { SharedService } from '../../../services/shared.service';
import { Chat } from '../../../models/chat.class';
import { User } from '../../../models/user.class';
import { UserDataService } from '../../../services/data.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  channels: Channel[] = [];
  chats: Chat[] = [];
  user: User[] = [];
  showChannels: boolean = true;
  showDirectChats: boolean = true;  

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
    console.log('ChatPartnerId: ' + chatpartnerId);
    console.log('Chat: ' + chat);
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
}
