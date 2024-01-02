import { Component, OnDestroy } from '@angular/core';
import { AddChannelDialogComponent } from '../../dialogs/add-channel-dialog/add-channel-dialog.component';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ChannelService } from '../../../services/channel.service';
import { Subscription } from 'rxjs';
import { Channel } from '../../../models/channel.class';
import { SharedService } from '../../../services/shared.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AddChannelDialogComponent, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnDestroy {
  channelsSubscription: Subscription;
  channels: Channel[] = [];

  constructor(private dialog: MatDialog, private channelService: ChannelService, private sharedService: SharedService) {
    this.channelsSubscription = this.channelService.channelsSubscription$.subscribe((channels) => {
      this.channels = channels;
    })
  }

  selectChannel(channelId: string) {
    this.sharedService.messageActive = false;
    this.sharedService.directChatActive = false;
    this.sharedService.channelChatActive = true;
    this.channelService.setSelectedChannel(channelId);
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
