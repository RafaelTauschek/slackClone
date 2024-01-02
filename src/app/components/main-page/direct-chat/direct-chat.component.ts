import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DirectChatChatareaComponent } from '../../chats/direct-chat-chatarea/direct-chat-chatarea.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, DirectChatChatareaComponent, FormsModule],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss'
})
export class DirectChatComponent {
  message: string = '';

}
