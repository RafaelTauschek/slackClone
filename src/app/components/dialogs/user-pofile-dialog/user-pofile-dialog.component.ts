import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../../services/shared.service';
import { UserDataService } from '../../../services/data.service';
import { Chat } from '../../../models/chat.class';


@Component({
  selector: 'app-user-pofile-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './user-pofile-dialog.component.html',
  styleUrl: './user-pofile-dialog.component.scss'
})
export class UserPofileDialogComponent {

  constructor(public dialogRef: MatDialogRef<UserPofileDialogComponent>, public sharedService: SharedService, public data: UserDataService) { 
  }




  closeDialog() {
    this.dialogRef.close();
  }


  openDirectChat() {
    const chatPartnerId = this.sharedService.currentPartner;
    const chatExits = this.data.checkIfChatExists(this.data.activeUser[0].id, chatPartnerId);
    if (chatExits) {
      this.data.setCurrentChat(chatExits);
    } else {
      const chat = new Chat({
        chatId: '',
        messages: [],
        users: [this.data.activeUser[0].id, chatPartnerId],
      });
     this.data.setCurrentChat([chat])
    }
    this.sharedService.channelChatActive = false;
    this.sharedService.messageActive = false; 
    this.sharedService.threadActive = false;
    this.sharedService.directChatActive = true;

    
    this.closeDialog();

  }

}
