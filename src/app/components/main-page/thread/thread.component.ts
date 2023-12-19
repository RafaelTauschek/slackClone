import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ThreadChatComponent } from '../../chats/thread-chat/thread-chat.component';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, ThreadChatComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {

}
