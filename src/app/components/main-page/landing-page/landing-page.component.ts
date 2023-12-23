import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChannelChatComponent } from '../../chats/channel-chat/channel-chat.component';
import { DirectChatComponent } from '../../chats/direct-chat/direct-chat.component';
import { ThreadComponent } from '../thread/thread.component';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from '../../../services/message.service';
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, ChannelChatComponent, DirectChatComponent, ThreadComponent, RouterOutlet, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  isThreadActive: boolean = true;
  isDirectChatActive: boolean = false;
  isChannelChatActive: boolean = true;


  constructor(private messageService: MessageService) {}



  setThread() {
    this.isThreadActive = true;
    this.isChannelChatActive = true;
    this.isDirectChatActive = false;
  }

  setDirectChat() {
    this.isThreadActive = false;
    this.isChannelChatActive = false;
    this.isDirectChatActive = true;
  }

  setChannelChat() {
    this.isChannelChatActive = true;
    this.isDirectChatActive = false;
    this.isThreadActive = false;
  }
}
