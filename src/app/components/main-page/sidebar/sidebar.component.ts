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
      console.log('Available Channels: ', channels);
    })
  }

  selectChannel(channelId: string) {
    this.sharedService.closeMessageChat();
    this.sharedService.openChannelChat();
    this.channelService.setSelectedChannel(channelId);
    console.log('Selected Channel: ', channelId);
    
  }

  ngOnDestroy(): void {
    this.channelsSubscription.unsubscribe();
  }



  openDialog() {
    this.dialog.open(AddChannelDialogComponent, {});
  }

  openNewMessage() {
    this.sharedService.closeChannelChat();
    this.sharedService.closeDirectChat();
    this.sharedService.closeThread();
    this.sharedService.openMessageChat();
  }
}
