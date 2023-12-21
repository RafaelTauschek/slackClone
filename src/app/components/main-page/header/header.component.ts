import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuDialogComponent } from '../../dialogs/menu-dialog/menu-dialog.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenuDialogComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(MenuDialogComponent, {});
  }
  

}
