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
import { MessageService } from '../../../services/message.service';
import { Message } from '../../../models/message.class';
import { Chat } from '../../../models/chat.class';
import { SearchService } from '../../../services/search.service';

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
  searchedChannelMessages!: MessageWithChannel[];
  searchedDirectMessages!: Message[];
  chats: Chat[] = [];
  chatSubscription: Subscription; 




  constructor(public userService: UserService, private authService: AuthService,
    private channelService: ChannelService, private dialog: MatDialog, 
    private sharedService: SharedService, private messageService: MessageService, private searchService: SearchService) {
    this.currentUserSubscription = this.userService.activeUserObservable$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
    this.availableUsersSubscription = this.userService.usersObservable$.subscribe((availableUsers) => {
      this.availableUsers = availableUsers;
    });
    this.chatSubscription = this.messageService.chatSubscription$.subscribe((chats) => {
      this.chats = chats;
    });
  }




  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe()
    this.availableUsersSubscription.unsubscribe();
    this.chatSubscription.unsubscribe();
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
    const searchedChannels = this.searchService.filterChannels(this.channelService.channelsSubscription.value, this.searchTerm);
    const searchedUsers = this.searchService.filterUsers(this.availableUsers, this.searchTerm);
    const searchedDirectMessages = this.searchService.filterDirectMessages(this.chats, this.searchTerm);
    const searchedChannelMessages = this.searchService.filterChannelMessages(this.channelService.channelsSubscription.value, this.searchTerm);
    console.log('Searched Channels: ', searchedChannels);
    console.log('Searched Users: ', searchedUsers);
    console.log('Searched Direct Messages: ', searchedDirectMessages);
    console.log('Searched Channel Messages: ', searchedChannelMessages);  
  }

 
}


