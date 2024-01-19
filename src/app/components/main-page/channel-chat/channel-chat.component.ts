import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChatAreaComponent } from '../../chats/chat-area/chat-area.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { Channel } from '../../../models/channel.class';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditChannelDialogComponent } from '../../dialogs/edit-channel-dialog/edit-channel-dialog.component';
import { User } from '../../../models/user.class';
import { SharedService } from '../../../services/shared.service';
import { UserDataService } from '../../../services/data.service';

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [CommonModule, ChatAreaComponent, RouterOutlet, RouterModule, PickerComponent, FormsModule, MatDialogModule],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss'
})
export class ChannelChatComponent {
  channel: Channel[] = [];
  message: string = '';
  memberInviteActive: boolean = false;
  memberListActive: boolean = false;
  selectedFileName: string = '';
  selectedFile: File | null = null;
  searchActive: boolean = false;
  searchedUsers: User[] = [];
  searchTerm: string = '';

  constructor(private dialog: MatDialog, public sharedService: SharedService, public data: UserDataService ) {
  }


  onSearch() {
    if (this.searchTerm !== '') {
      this.searchActive = true;
      this.searchedUsers = this.sharedService.filterUsers(this.data.users ,this.searchTerm);
    } else {
      this.searchActive = false;
    }
  }

  userToAdd: string[] = [];

  addUserToChannel(userId: string) {
    this.userToAdd.push(userId);
    this.searchActive = false;
    this.searchTerm = '';
  }

  removeUser(user: string) {
    this.userToAdd = this.userToAdd.filter((u) => u !== user);
  }

  async updateUsersOnChannel() {
    const users: string[] = this.userToAdd;
    this.userToAdd = [];
    await this.data.addChannelToUsers(users, this.channel[0].id);
  }

  openMemberList() {
    this.memberListActive = true;
  }

  openInviteList() {
    this.memberListActive = false;
    this.memberInviteActive = true;
  }


  closeMenus() {
    this.memberInviteActive = false;
    this.memberListActive = false;  
  }

  openDialog() {
    this.dialog.open(EditChannelDialogComponent, {});
  }



  addEmoji(event: Event) {
    console.log('Event activated: ', event);
  }



  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.selectedFileName = this.selectedFile?.name ?? '';
    }
  }

  async sendMessage() {
    if (this.message !== '' || this.selectedFile) {
      this.data.sendChannelMessage(this.message, this.selectedFile);
    } 
    this.message = '';
    this.selectedFile = null;
  }
}
