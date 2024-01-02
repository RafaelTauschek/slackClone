import { Component, OnDestroy } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../../services/shared.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';

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

  constructor(public dialogRef: MatDialogRef<UserPofileDialogComponent>, private sharedService: SharedService, public userService: UserService) { 
    this.currentUserIdSubscription = this.sharedService.currentChatPartnerId$.subscribe((currentUserId) => {
      this.currentUserId = currentUserId;
    });
  }


  ngOnDestroy(): void {
    this.currentUserIdSubscription.unsubscribe();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openDirectChat() {
    this.sharedService.directChatActive = true;
  }
}
