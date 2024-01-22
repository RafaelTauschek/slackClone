import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Chat } from '../../../models/chat.class';
import { SharedService } from '../../../services/shared.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UserDataService } from '../../../services/data.service';
@Component({
  selector: 'app-direct-chat-chatarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './direct-chat-chatarea.component.html',
  styleUrl: './direct-chat-chatarea.component.scss'
})
export class DirectChatChatareaComponent {

  constructor (public sharedService: SharedService, public sanitizer: DomSanitizer, public data: UserDataService) {
    console.log(data.currentChat);
  }
}
