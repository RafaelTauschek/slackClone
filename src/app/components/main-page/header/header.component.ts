import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { User } from '../../../models/user.class';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Channel } from '../../../models/channel.class';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserPofileDialogComponent } from '../../dialogs/user-pofile-dialog/user-pofile-dialog.component';
import { SharedService } from '../../../services/shared.service';
import { Message } from '../../../models/message.class';
import { UserDataService } from '../../../services/data.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})



export class HeaderComponent {
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
  isEditing: boolean = false;



  constructor(private authService: AuthService, private dialog: MatDialog, public sharedService: SharedService, 
    public data: UserDataService) { }





  closeProfileMenu() {
    this.profileMenu = false;
  }

  openProfileMenu() {
    this.userMenu = false;
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

  openChannel(channel: Channel) {
    this.data.setChannel(channel);
    this.sharedService.directChatActive = false;
    this.sharedService.threadActive = false;
    this.sharedService.messageActive = false;
    this.sharedService.channelChatActive = true;
    this.searchTerm = '';
    this.searchActive = false;
  }



  async editUserName() {
    const user = this.data.activeUser[0];
    if (this.editedUserName !== '' && user.name) {
      await this.data.updateUserProperties({ name: this.editedUserName });
    }
  }

  async editUserMail() {
    const user = this.data.activeUser[0];
    if (this.editedUserMail !== '' && user.email) {
      await this.data.updateUserProperties({ email: this.editedUserMail });
      await this.authService.updateEmail(this.editedUserMail);
    }
  }

  onSearch() {
    if (this.searchTerm !== '') {
      this.searchActive = true;
      this.searchedChannel = this.sharedService.filterChannels(this.data.userChannels, this.searchTerm);
      this.searchedUser = this.sharedService.filterUsers(this.data.users, this.searchTerm);
      this.searchedDirectMessages = this.sharedService.filterDirectMessages(this.data.chats, this.searchTerm);
      this.searchedChannelMessages = this.sharedService.filterChannelMessages(this.data.userChannels, this.searchTerm);
    } else {
      this.searchActive = false;
    }
  }

  redirectToChannel(data: any) {
    const channelId = data.channel.id;
    const message = data.message;
    const indices = this.findMessageIndex(message.timestamp, [data.channel]);
    this.data.setChannel(channelId);
    this.sharedService.directChatActive = false;
    this.sharedService.threadActive = false;
    this.sharedService.messageActive = false;
    this.sharedService.channelChatActive = true;
    setTimeout(() => {
      this.sharedService.scrollIntoView(indices.dayIndex, indices.messageIndex)
    }, 500)
  }

  redirectToDirectChat(message: any) {}

  findMessageIndex(timestamp: string, channel: any[]): { dayIndex: number, messageIndex: number } {
    for (let dayIndex = 0; dayIndex < this.data.messages.length; dayIndex++) {
      const day = this.data.messages[dayIndex];
      for (let messageIndex = 0; messageIndex < day.messages.length; messageIndex++) {
        const message = day.messages[messageIndex];
        if (message.timestamp === timestamp && channel.includes(message.channel)) {
          return { dayIndex, messageIndex };
        }
      }
    }
    return { dayIndex: -1, messageIndex: -1 };
  }


}


