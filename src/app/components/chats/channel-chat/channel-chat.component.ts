import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChatAreaComponent } from '../chat-area/chat-area.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [CommonModule, ChatAreaComponent, RouterOutlet, RouterModule, PickerComponent],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss'
})
export class ChannelChatComponent {

  addEmoji(event: Event) {
    console.log('Event activated: ', event);
    
  }
}
