import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-direct-chat-chatarea',
  standalone: true,
  imports: [],
  templateUrl: './direct-chat-chatarea.component.html',
  styleUrl: './direct-chat-chatarea.component.scss'
})
export class DirectChatChatareaComponent {
  user: any;
  userSubscription: Subscription

  constructor(private userService: UserService) {
    this.userSubscription = this.userService.activeUserObservable$.subscribe((user) => {
      this.user = user;
      console.log(this.user);
    })
  }
}
