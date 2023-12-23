import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-add-channel-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './add-channel-dialog.component.html',
  styleUrl: './add-channel-dialog.component.scss'
})
export class AddChannelDialogComponent {
  channelName: string = '';
  channelDescription: string = '';

  constructor(private dialog: MatDialogRef<AddChannelDialogComponent>, private firebaseService: FirebaseService, private userService: UserService) { }

  closeDialog() {
    this.dialog.close();
  }

  addChannel() {
    if (this.channelName == '') {
      console.log('Name is empty');
    } else {
      console.log('Channel generated with name:', this.channelName);
      console.log('Channel generated with description:', this.channelDescription);
      const channelData = {
        name: this.channelName,
        description: this.channelDescription,
      }

      this.firebaseService.addCollection('channels', channelData)
      

      this.closeDialog();
    }
  }
}
