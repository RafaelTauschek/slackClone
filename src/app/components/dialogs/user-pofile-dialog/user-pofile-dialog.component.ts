import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../../services/shared.service';
import { UserDataService } from '../../../services/data.service';


@Component({
  selector: 'app-user-pofile-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './user-pofile-dialog.component.html',
  styleUrl: './user-pofile-dialog.component.scss'
})
export class UserPofileDialogComponent {
  currentUserId: string = '';

  constructor(public dialogRef: MatDialogRef<UserPofileDialogComponent>, public sharedService: SharedService, public data: UserDataService) { 
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
    const userId = this.data.activeUser[0].id;
    const chatExits = this.data.checkIfChatExists(userId, chatPartnerId);
    this.closeDialog();
  }

}
