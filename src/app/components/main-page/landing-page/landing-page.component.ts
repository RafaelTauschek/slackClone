import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChannelChatComponent } from '../../chats/channel-chat/channel-chat.component';
import { DirectChatComponent } from '../../chats/direct-chat/direct-chat.component';
import { ThreadComponent } from '../thread/thread.component';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, ChannelChatComponent, DirectChatComponent, ThreadComponent, RouterOutlet, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
