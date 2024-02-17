import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChatAreaComponent } from '../../chats/chat-area/chat-area.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditChannelDialogComponent } from '../../dialogs/edit-channel-dialog/edit-channel-dialog.component';
import { User } from '../../../models/user.class';
import { SharedService } from '../../../services/shared.service';
import { UserDataService } from '../../../services/data.service';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Message } from '../../../models/message.class';

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [CommonModule, ChatAreaComponent, RouterOutlet, RouterModule, PickerComponent, FormsModule, MatDialogModule, EmojiModule],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss'
})
export class ChannelChatComponent {
  message: string = '';
  memberInviteActive: boolean = false;
  memberListActive: boolean = false;
  selectedFileName: string = '';
  selectedFile: File | null = null;
  searchActive: boolean = false;
  searchedUsers: User[] = [];
  searchTerm: string = '';
  showEmojiPicker = false;  
  userToAdd: string[] = [];
  
  constructor(private dialog: MatDialog, public sharedService: SharedService, public data: UserDataService ) {}



  toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
  }

  onSearch() {
    if (this.searchTerm !== '') {
      this.searchActive = true;
      this.searchedUsers = [];
      this.searchedUsers = this.sharedService.filterUsers(this.data.users ,this.searchTerm);
    } else {
      this.searchActive = false;
    }
  }



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
    await this.data.addChannelToUsers(users, this.data.currentChannel.id);
    this.memberInviteActive = false;
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
    this.atUser = false
  }

  openDialog() {
    this.dialog.open(EditChannelDialogComponent, {});
  }


  addEmoji(event: any) {
    this.message += event.emoji.native;
    this.toggleEmojiPicker();
  }



  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.selectedFileName = this.selectedFile?.name ?? '';
    }
  }

  async sendMessage() {
    if (this.message !== '' || this.selectedFile) {
      let filename = '';
      let fileUrl = '';
      try {
        if (this.selectedFile) {
          filename = this.selectedFile.name;
          fileUrl = await this.data.uploadFile(this.selectedFile);
        }
        const message = this.data.generateNewMessage(this.message, filename, fileUrl);
        this.updateMessages(message);
      } catch (err) {
        console.error(err);
      }
    }
     this.message = '';
     this.selectedFile = null;
     this.selectedFileName = '';
  }

  async updateMessages(message: Message) {
    const channelId = this.data.currentChannel.id;
    if (message) {
      await this.data.updateMessages('channels', channelId, message.toJSON());
      await this.data.loadChannelData(channelId);
      await this.data.loadChannelsData(this.data.activeUser);
      this.data.formatChannel(this.data.currentChannel);
    }
  }

  atUser: boolean = false;

  atUserChat() {
    this.atUser = !this.atUser;
  }

  atUserToChat(user: User) {
    const username = user.name;
    const formatedString = "@" + username;
    this.message += formatedString 
    this.atUser = false;
  }
}
