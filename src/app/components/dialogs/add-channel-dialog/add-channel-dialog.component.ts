import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { User } from '../../../models/user.class';
import { UserDataService } from '../../../services/data.service';

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
  addingChannel: boolean = false;

  constructor(private dialog: MatDialogRef<AddChannelDialogComponent>, private firebaseService: FirebaseService, private data: UserDataService) { 
    this.activeUser = this.data.activeUser;
  }

  closeDialog() {
    this.dialog.close();
  }

  async addChannel() {
    this.addingChannel = true;
    if (this.checkIfChannelExists(this.channelName)) {
      this.addingChannel = false;
    } else {
      const date = new Date().getTime();
      const channelData = {
        name: this.channelName,
        description: this.channelDescription,
        creator: this.activeUser[0].id,
        id: '',
        messages: [],
        creationDate: date,
        users: [this.activeUser[0].id],
      }
      const docRef = await this.firebaseService.addCollection('channels', channelData);
      channelData.id = docRef
      await this.firebaseService.updateDocument('channels', docRef, channelData);
      this.data.loadChannelsData(this.activeUser);
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
      this.addingChannel = false;
      this.closeDialog();
    }
  }

  checkIfChannelExists(channelName: string) {
    if (channelName == '') {
      return false;
    } else {
      const channel = this.data.channelList.find(channel => channel.name == channelName);
      if (channel) {
        return true;
      } else {
        return false;
      }
    }
  }
}
