import { Component, OnDestroy } from '@angular/core';
import { Message } from '../../../models/message.class';
import { MessageService } from '../../../services/message.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thread-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thread-chat.component.html',
  styleUrl: './thread-chat.component.scss'
})
export class ThreadChatComponent implements OnDestroy {
  message: Message[] = [];
  messageSubscription: Subscription;

  constructor(private messageService: MessageService, public userService: UserService, public sharedService: SharedService) {
    this.messageSubscription = this.messageService.singleMessageSubscription$.subscribe((message) => {
      this.message = message;
      console.log(this.message);
    }) 
  }



  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
  }

}
