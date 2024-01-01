import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-channel-dialog',
  standalone: true,
  imports: [MatDialogModule, CommonModule],
  templateUrl: './edit-channel-dialog.component.html',
  styleUrl: './edit-channel-dialog.component.scss'
})
export class EditChannelDialogComponent {
  channelNameEditActive: boolean = false;
  channelDescriptionEditActive: boolean = false;

  constructor(private dialog: MatDialogRef<EditChannelDialogComponent>) { }

  closeDialog() {
    this.dialog.close();
  }
}
