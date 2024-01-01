import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-pofile-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './user-pofile-dialog.component.html',
  styleUrl: './user-pofile-dialog.component.scss'
})
export class UserPofileDialogComponent {

  constructor(public dialogRef: MatDialogRef<UserPofileDialogComponent>) {}


  closeDialog() {
    this.dialogRef.close();
  }

  openDirectChat() {
    
  }
}
