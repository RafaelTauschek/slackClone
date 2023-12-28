import { Component, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChannelChatComponent } from '../../chats/channel-chat/channel-chat.component';
import { DirectChatComponent } from '../../chats/direct-chat/direct-chat.component';
import { ThreadComponent } from '../thread/thread.component';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from '../../../services/message.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../services/shared.service';
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, ChannelChatComponent, DirectChatComponent, ThreadComponent, RouterOutlet, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnDestroy {
  isThreadActive: boolean = false;
  threadSubscription: Subscription;
  isDirectChatActive: boolean = false;
  directChatSubscription: Subscription;
  isChannelChatActive: boolean = true;
  channelChatSubscription: Subscription;


  constructor(private messageService: MessageService, private sharedService: SharedService) {

    this.threadSubscription = this.sharedService.threadActive$.subscribe((threadActive: boolean) => {
      this.isThreadActive = threadActive;
      if (this.isThreadActive) {
        this.setThread();
      }
    });
    this.directChatSubscription = this.sharedService.directChatActive$.subscribe((directChatActive: boolean) => {
      this.isDirectChatActive = directChatActive;
      if (this.isDirectChatActive) {
        this.setDirectChat();
      }
    });
    this.channelChatSubscription = this.sharedService.channelChatActive$.subscribe((channelChatActive: boolean) => {
      this.isChannelChatActive = channelChatActive;
      if (this.isChannelChatActive) {
        this.setChannelChat();
      }
    });
  }


  ngOnDestroy(): void {
    this.threadSubscription.unsubscribe();
    this.directChatSubscription.unsubscribe();
    this.channelChatSubscription.unsubscribe();
  }


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
