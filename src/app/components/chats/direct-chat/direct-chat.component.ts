import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ChatAreaComponent } from '../chat-area/chat-area.component';

@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, ChatAreaComponent],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss'
})
export class DirectChatComponent {

}
