import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChatAreaComponent } from '../chat-area/chat-area.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [CommonModule, ChatAreaComponent, RouterOutlet, RouterModule],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss'
})
export class ChannelChatComponent {

}
