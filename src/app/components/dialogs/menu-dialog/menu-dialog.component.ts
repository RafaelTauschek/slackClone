import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-menu-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './menu-dialog.component.html',
  styleUrl: './menu-dialog.component.scss'
})
export class MenuDialogComponent {


  constructor(private dialog: MatDialogRef<MenuDialogComponent>) {}


  closeDialog() {
    this.dialog.close();
  }
}
