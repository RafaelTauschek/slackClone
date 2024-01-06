import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ChannelService } from '../../../services/channel.service';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../../models/channel.class';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-edit-channel-dialog',
  standalone: true,
  imports: [MatDialogModule, CommonModule, FormsModule],
  templateUrl: './edit-channel-dialog.component.html',
  styleUrl: './edit-channel-dialog.component.scss'
})
export class EditChannelDialogComponent {
  channelNameEditActive: boolean = false;
  channelDescriptionEditActive: boolean = false;
  description: string = '';
  name: string = '';
  channel: Channel[] = [];
  channelSubscription: Subscription;

  constructor(private dialog: MatDialogRef<EditChannelDialogComponent>, private channelService: ChannelService, public userService: UserService) {
    this.channelSubscription = this.channelService.channelSubscription$.subscribe((channel) => {
      this.channel = channel;
    });
  }

  closeDialog() {
    this.dialog.close();
  }

  editChannelName() {
    if (this.name !== '') {
      this.channelService.editChannelName(this.name);
    }
    this.channelNameEditActive = false;
  }

  editChannelDescription() {
    if (this.description !== '') {
      this.channelService.editChannelDescription(this.description);
    }
    this.channelDescriptionEditActive = false;
  }
  
  leaveChannel() {
  }
}
