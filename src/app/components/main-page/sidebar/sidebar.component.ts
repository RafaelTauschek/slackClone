import { Component, OnDestroy } from '@angular/core';
import { AddChannelDialogComponent } from '../../dialogs/add-channel-dialog/add-channel-dialog.component';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ChannelService } from '../../../services/channel.service';
import { Subscription } from 'rxjs';
import { Channel } from '../../../models/channel.class';
import { SharedService } from '../../../services/shared.service';
import { Chat } from '../../../models/chat.class';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.class';
import { UserDataService } from '../../../services/data.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AddChannelDialogComponent, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnDestroy {
  channelsSubscription: Subscription;
  chatSubscription: Subscription;
  userSubscription: Subscription;
  channels: Channel[] = [];
  chats: Chat[] = [];
  user: User[] = [];
  showChannels: boolean = true;
  showDirectChats: boolean = true;  

  constructor(private dialog: MatDialog, private channelService: ChannelService, public sharedService: SharedService, 
    private messageService: MessageService, public userService: UserService, public data: UserDataService) {
    this.channelsSubscription = this.channelService.channelsSubscription$.subscribe((channels) => {
      this.channels = channels;
    })
    this.chatSubscription = this.messageService.chatsSubscription$.subscribe((chats) => {
      this.chats = chats;
    });
    this.userSubscription = this.userService.activeUserObservable$.subscribe((user) => {
      this.user = user;
    });
  }

  selectChannel(channelId: string) {
    if (this.sharedService.isMobile) {
      this.sharedService.activeComponent = 'channel-chat';
    }
    this.channelService.setSelectedChannel(channelId);
    this.data.setChannel(channelId);
    this.sharedService.messageActive = false;
    this.sharedService.directChatActive = false;
    this.sharedService.channelChatActive = true;
  }

  ngOnDestroy(): void {
    this.channelsSubscription.unsubscribe();
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
    this.messageService.setCurrentChat([chat]);

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
