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
  channels: Channel[] = [];
  chats: Chat[] = [];

  constructor(private dialog: MatDialog, private channelService: ChannelService, private sharedService: SharedService, private messageService: MessageService) {
    this.channelsSubscription = this.channelService.channelsSubscription$.subscribe((channels) => {
      this.channels = channels;
    })
    this.chatSubscription = this.messageService.chatSubscription$.subscribe((chats) => { 
      this.chats = chats;
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

  openDirectChat() {
    this.sharedService.channelChatActive = false;
    this.sharedService.messageActive = false;
    this.sharedService.threadActive = false;
    this.sharedService.directChatActive = true;
  }
}
