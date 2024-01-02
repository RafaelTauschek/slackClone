import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-direct-chat-chatarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './direct-chat-chatarea.component.html',
  styleUrl: './direct-chat-chatarea.component.scss'
})
export class DirectChatChatareaComponent {
  user: any;
  userSubscription: Subscription;
  messagesAvailable: boolean = false;

  constructor(private userService: UserService) {
    this.userSubscription = this.userService.activeUserObservable$.subscribe((user) => {
      this.user = user;
    })
  }
}
