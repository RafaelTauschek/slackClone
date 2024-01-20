import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../../models/channel.class';
import { UserDataService } from '../../../services/data.service';

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

  constructor(private dialog: MatDialogRef<EditChannelDialogComponent>, public data: UserDataService) {
  }

  closeDialog() {
    this.dialog.close();
  }

  editChannelName() {
    if (this.name !== '') {
      this.data.updateChannelProperties({name: this.name});
    }
    this.channelNameEditActive = false;
  }

  editChannelDescription() {
    if (this.description !== '') {
      this.data.updateChannelProperties({description: this.description});
    }
    this.channelDescriptionEditActive = false;
  }
  
  leaveChannel(userId: string, channel: Channel) {
    this.data.leaveChannel(userId, channel);
    this.closeDialog();
  }
}
