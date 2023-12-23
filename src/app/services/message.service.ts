import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class MessageService implements OnDestroy {
  activeUserSubscription: Subscription;
  activeUser: User[] = []

  constructor(private userService: UserService) {
    this.activeUserSubscription = this.userService.activeUserObservable$.subscribe((activeUser) => {
      this.activeUser = activeUser;
    })
  }



  ngOnDestroy(): void {
    this.activeUserSubscription.unsubscribe();
  }
}
