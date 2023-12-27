import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuDialogComponent } from '../../dialogs/menu-dialog/menu-dialog.component';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../../models/user.class';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenuDialogComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnDestroy {
  currentUser: User[] = []
  currentUserSubscription: Subscription;


  constructor(private dialog: MatDialog, private userService: UserService, private authService: AuthService) {
    this.authService.authCurrentUser();
    this.currentUserSubscription = this.userService.activeUserObservable$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
  }


  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe()
  }
  openDialog() {
    this.dialog.open(MenuDialogComponent, {});
  }
}
