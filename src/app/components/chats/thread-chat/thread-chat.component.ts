import { Component } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../../services/data.service';
import { Message } from '../../../models/message.class';

@Component({
  selector: 'app-thread-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thread-chat.component.html',
  styleUrl: './thread-chat.component.scss'
})
export class ThreadChatComponent {

  constructor(public sharedService: SharedService, public data: UserDataService) {
    
  }




}
