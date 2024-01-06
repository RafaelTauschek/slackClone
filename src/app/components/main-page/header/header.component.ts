import { Component, OnDestroy } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../../models/user.class';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Channel } from '../../../models/channel.class';
import { ChannelService } from '../../../services/channel.service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserPofileDialogComponent } from '../../dialogs/user-pofile-dialog/user-pofile-dialog.component';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnDestroy {
  currentUser: User[] = []
  currentUserSubscription: Subscription;
  userMenu: boolean = false;
  profileMenu: boolean = false;
  editMenu: boolean = false;
  searchUser: boolean = false;
  searchChannel: boolean = false;
  searchedChannel: Channel[] = [];
  searchedUser: User[] = [];
  availableUsersSubscription: Subscription;
  availableUsers: User[] = [];
  searchActive: boolean = false;
  searchTerm: string = '';
  editedUserName: string = '';
  editedUserMail: string = '';


  constructor(private userService: UserService, private authService: AuthService,
    private channelService: ChannelService, private dialog: MatDialog, private sharedService: SharedService) {
    this.currentUserSubscription = this.userService.activeUserObservable$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
    this.availableUsersSubscription = this.userService.usersObservable$.subscribe((availableUsers) => {
      this.availableUsers = availableUsers;
    });
  }


  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe()
    this.availableUsersSubscription.unsubscribe();
  }

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
    this.editUserName();
    this.editUserMail();
    await this.userService.loadUser(this.currentUser[0].id);
  }

  logout() {
    this.authService.logout();
  }

  openDialog() {
    this.dialog.open(UserPofileDialogComponent, {});
  }


  openUser(userId: string) {
    this.sharedService.currentPartner = userId;
    this.openDialog();
    this.searchTerm = '';
    this.searchActive = false;
  }

  openChannel(channelId: string) {
    this.channelService.setSelectedChannel(channelId);
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
    if (this.editedUserName !== '' || user.name) {
      await this.userService.editUserName(this.editedUserName);
    } else {
      console.log('No changes were made');
    }
  }

  async editUserMail() {
    const user = this.currentUser[0];
    if (this.editedUserMail !== '' || user.email) {
      await this.userService.editUserMail(this.editedUserMail);
    } else {
      console.log('No changes were made');
    }
  }


  onSearch() {
    const channels: Channel[] = this.channelService.channels;
    const users: User[] = this.availableUsers;
    this.searchUser = false;
    this.searchChannel = false;
    this.searchActive = false;

    if (this.searchTerm.charAt(0) === '#') {
      this.searchActive = true;
      this.searchChannel = true;
      const searchTermWithoutHash = this.searchTerm.substring(1).toLowerCase();
      const filteredChannels = channels.filter(channel => channel.name.toLowerCase().startsWith(searchTermWithoutHash));
      console.log('Channels matching the search term: ', filteredChannels);
      this.searchedChannel = filteredChannels;
      console.log('Searched Channel var: ', this.searchedChannel);
    }

    if (this.searchTerm.charAt(0) === '@') {
      this.searchActive = true;
      this.searchUser = true;
      const searchTermWithoutAt = this.searchTerm.substring(1).toLowerCase();
      const filteredUsers = users.filter(user => user.name.toLowerCase().startsWith(searchTermWithoutAt));
      console.log('Users matching the search term: ', filteredUsers);
      this.searchedUser = filteredUsers;
      console.log('Searched User var: ', this.searchedUser);
    }

  }


}


