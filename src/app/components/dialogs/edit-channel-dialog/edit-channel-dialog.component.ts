import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-channel-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './edit-channel-dialog.component.html',
  styleUrl: './edit-channel-dialog.component.scss'
})
export class EditChannelDialogComponent {

  constructor(private dialog: MatDialogRef<EditChannelDialogComponent>) { }

  closeDialog() {
    this.dialog.close();
  }
}
