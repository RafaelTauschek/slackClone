import { Component } from '@angular/core';
import { User } from '../../../models/user.class';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Channel } from '../../../models/channel.class';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserPofileDialogComponent } from '../../dialogs/user-pofile-dialog/user-pofile-dialog.component';
import { SharedService } from '../../../services/shared.service';
import { Message } from '../../../models/message.class';
import { Chat } from '../../../models/chat.class';
import { UserDataService } from '../../../services/data.service';

interface MessageWithChannel extends Message {
  channelName: string;
}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})



export class HeaderComponent {
  currentUser: User[] = []
  userMenu: boolean = false;
  profileMenu: boolean = false;
  editMenu: boolean = false;
  searchUser: boolean = false;
  searchChannel: boolean = false;
  searchedChannel: Channel[] = [];
  searchedUser: User[] = [];
  availableUsers: User[] = [];
  searchActive: boolean = false;
  searchTerm: string = '';
  editedUserName: string = '';
  editedUserMail: string = '';
  searchedChannelMessages!: any;
  searchedDirectMessages!: Message[];
  chats: Chat[] = [];
  isEditing: boolean = false;



  constructor(private authService: AuthService, private dialog: MatDialog, public sharedService: SharedService, public data: UserDataService) { }





  closeProfileMenu() {
    this.profileMenu = false;
  }

  openProfileMenu() {
    this.profileMenu = true;
  }

  closeEditMenu() {
    this.editMenu = false;
  }


  closeMenus() {
    this.userMenu = false;
    this.profileMenu = false;
  }

  openEditMenu() {
    this.profileMenu = false;
    this.editMenu = true;
  }

  async saveChanges() {
    this.isEditing = true;
    await this.editUserName();
    await this.editUserMail();
    this.isEditing = false;
  }

  logout() {
    this.authService.logout();
  }

  openDialog() {
    this.dialog.open(UserPofileDialogComponent, {});
  }

  goToSidebar() {
    this.sharedService.activeComponent = 'sidebar';
  }


  openUser(userId: string) {
    this.sharedService.setCurrentChatPartnerId(userId);
    this.openDialog();
    this.searchTerm = '';
    this.searchActive = false;
  }

  openChannel(channelId: string) {
    console.log('channel was opend with id: ', channelId);
    this.sharedService.directChatActive = false;
    this.sharedService.threadActive = false;
    this.sharedService.messageActive = false;
    this.sharedService.channelChatActive = true;
    this.searchTerm = '';
    this.searchActive = false;
  }



  async editUserName() {
    const user = this.currentUser[0];
    console.log('User: ', user);
    if (this.editedUserName !== '' && user.name) {
      console.log('Name changes were made');
      await this.data.updateUserProperties({ name: this.editedUserName });
    } else {
      console.log('No changes were made');
    }
  }

  async editUserMail() {
    const user = this.currentUser[0];
    console.log('User: ', user);
    if (this.editedUserMail !== '' && user.email) {
      console.log('Mail changes were made');
      await this.data.updateUserProperties({ email: this.editedUserMail });
    } else {
      console.log('No changes were made');
    }
  }

  onSearch() {
    if (this.searchTerm !== '') {
      this.searchActive = true;
      this.searchedChannel = this.sharedService.filterChannels(this.data.userChannels, this.searchTerm);
      this.searchedUser = this.sharedService.filterUsers(this.data.users, this.searchTerm);
      this.searchedDirectMessages = this.sharedService.filterDirectMessages(this.data.chats, this.searchTerm);
      this.searchedChannelMessages = this.sharedService.filterChannelMessages(this.data.channelList, this.searchTerm);
    } else {
      this.searchActive = false;
    }
  }


}


