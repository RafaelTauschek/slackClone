import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-menu-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './menu-dialog.component.html',
  styleUrl: './menu-dialog.component.scss'
})
export class MenuDialogComponent {


  constructor(private dialog: MatDialogRef<MenuDialogComponent>, private authService: AuthService) {}


  closeDialog() {
    this.dialog.close();
  }

  logout() {
    this.authService.logout();
    this.closeDialog();
  }
}
