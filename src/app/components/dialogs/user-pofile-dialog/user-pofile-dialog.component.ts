import { Component, OnDestroy } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../../services/shared.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-user-pofile-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './user-pofile-dialog.component.html',
  styleUrl: './user-pofile-dialog.component.scss'
})
export class UserPofileDialogComponent implements OnDestroy {
  currentUserId: string = '';
  currentUserIdSubscription: Subscription;

  constructor(public dialogRef: MatDialogRef<UserPofileDialogComponent>, public sharedService: SharedService, public userService: UserService, private messageService: MessageService) { 
    this.currentUserIdSubscription = this.sharedService.currentChatPartnerId$.subscribe((currentUserId) => {
      this.currentUserId = currentUserId;
      console.log(this.currentUserId);
    });
  }


  ngOnDestroy(): void {
    this.currentUserIdSubscription.unsubscribe();
  }

  closeDialog() {
    this.dialogRef.close();
  }


  openDirectChat() {
    this.sharedService.channelChatActive = false;
    this.sharedService.messageActive = false; 
    this.sharedService.threadActive = false;
    this.sharedService.directChatActive = true;
    const chatPartnerId = this.currentUserId;
    const userId = this.userService.activeUser.value[0].id;
    const chatExits = this.messageService.checkIfChatExists(userId, chatPartnerId);
    
    this.closeDialog();
  }

}
