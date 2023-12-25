import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.class';
import { ChannelService } from '../../../services/channel.service';

@Component({
  selector: 'app-add-channel-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './add-channel-dialog.component.html',
  styleUrl: './add-channel-dialog.component.scss'
})
export class AddChannelDialogComponent {
  activeUser: User[] = []
  channelName: string = '';
  channelDescription: string = '';

  constructor(private dialog: MatDialogRef<AddChannelDialogComponent>, private firebaseService: FirebaseService, 
    private userService: UserService, private channelService: ChannelService) { 
    this.activeUser = this.userService.activeUser.value;
    console.log(this.activeUser);  
  }

  closeDialog() {
    this.dialog.close();
  }

  async addChannel() {
    if (this.channelName == '') {
      console.log('Name is empty');
    } else {
      const channelData = {
        name: this.channelName,
        description: this.channelDescription,
        creator: this.activeUser[0].id,
        id: '',
      }

      const docRef = await this.firebaseService.addCollection('channels', channelData);
      console.log(docRef);
      channelData.id = docRef
      console.log(channelData);
      await this.firebaseService.updateDocument('channels', docRef, channelData);
      this.activeUser[0].channels.push(docRef);
      const userData = {
        name: this.activeUser[0].name,
        email: this.activeUser[0].email,
        profilepicture: this.activeUser[0].profilepicture,
        id: this.activeUser[0].id,
        channels: this.activeUser[0].channels,
        chats: this.activeUser[0].chats,
      }
      await this.firebaseService.updateDocument('users', this.activeUser[0].id, userData);
      this.channelService.loadChannels();
      this.closeDialog();
    }
  }
}
