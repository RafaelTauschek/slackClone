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

  constructor(private dialog: MatDialog, private channelService: ChannelService, public sharedService: SharedService, private messageService: MessageService, public userService: UserService) {
    this.channelsSubscription = this.channelService.channelsSubscription$.subscribe((channels) => {
      this.channels = channels;
    })
    this.chatSubscription = this.messageService.chatsSubscription$.subscribe((chats) => { 
      this.chats = chats;
    });
    this.userSubscription = this.userService.usersObservable$.subscribe((user) => {
      this.user = user;
    }); 
  }

  selectChannel(channelId: string) {
    this.channelService.setSelectedChannel(channelId);
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
    this.sharedService.channelChatActive = false;
    this.sharedService.directChatActive = false;
    this.sharedService.threadActive = false;
    this.sharedService.messageActive = true;
  }

  async openDirectChat(chatpartnerId: string, chat: Chat) {
    console.log('chatpartnerId', chatpartnerId);
    this.sharedService.setCurrentChatPartnerId(chatpartnerId);
    this.messageService.setCurrentChat([chat]);
    this.sharedService.channelChatActive = false;
    this.sharedService.messageActive = false;
    this.sharedService.threadActive = false;
    this.sharedService.directChatActive = true;
  }
}
