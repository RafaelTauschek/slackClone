import { Component, OnDestroy } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../../models/user.class';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnDestroy {
  currentUser: User[] = []
  currentUserSubscription: Subscription;
  userMenu: boolean = false;
  profileMenu: boolean = false;
  editMenu: boolean = false;


  constructor(private userService: UserService, private authService: AuthService) {
    this.authService.authCurrentUser();
    this.currentUserSubscription = this.userService.activeUserObservable$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
  }


  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe()
  }

  closeProfileMenu() {
    this.profileMenu = false;
  }

  openProfileMenu() {
    this.profileMenu = true;
  }

  closeEditMenu() {
    this.editMenu = false;
  }


  closeMenus() {
    this.userMenu = false;
    this.profileMenu = false;
  }

  openEditMenu() {
    this.profileMenu = false;
    this.editMenu = true;
  }

  saveChanges() {
    console.log('save btn funktioniert!');
  }

}
