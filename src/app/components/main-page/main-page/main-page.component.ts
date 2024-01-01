import { Component, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ThreadComponent } from '../thread/thread.component';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from '../../../services/message.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../services/shared.service';
import { ChannelChatComponent } from '../channel-chat/channel-chat.component';
import { DirectChatComponent } from '../direct-chat/direct-chat.component';
import { NewMessageComponent } from '../new-message/new-message.component';
@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, ChannelChatComponent, DirectChatComponent, ThreadComponent, RouterOutlet, RouterModule, NewMessageComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnDestroy {
  isThreadActive: boolean = false;
  threadSubscription: Subscription;
  isDirectChatActive: boolean = false;
  directChatSubscription: Subscription;
  isChannelChatActive: boolean = true;
  channelChatSubscription: Subscription;
  isNewMessageActive: boolean = false;
  newMessageSubscription: Subscription;
  isSidebarOpen: boolean = true;



  constructor(private sharedService: SharedService) {

    this.threadSubscription = this.sharedService.threadActive$.subscribe((threadActive: boolean) => {
      this.isThreadActive = threadActive;
      // if (this.isThreadActive) {
      //   this.setThread();
      // }
    });
    this.directChatSubscription = this.sharedService.directChatActive$.subscribe((directChatActive: boolean) => {
      this.isDirectChatActive = directChatActive;
      // if (this.isDirectChatActive) {
      //   this.setDirectChat();
      // }
    });
    this.channelChatSubscription = this.sharedService.channelChatActive$.subscribe((channelChatActive: boolean) => {
      this.isChannelChatActive = channelChatActive;
      // if (this.isChannelChatActive) {
      //   this.setChannelChat();
      // }
    });

    this.newMessageSubscription = this.sharedService.messageActive$.subscribe((newMessageActive: boolean) => {
      this.isNewMessageActive = newMessageActive;
      // if (this.isNewMessageActive) {
      //   this.setMessageChat();
      // }
    });
  }


  ngOnDestroy(): void {
    this.threadSubscription.unsubscribe();
    this.directChatSubscription.unsubscribe();
    this.channelChatSubscription.unsubscribe();
    this.newMessageSubscription.unsubscribe();
  }

  setMessageChat() {
    // this.isThreadActive = false;
    // this.isChannelChatActive = false;
    // this.isDirectChatActive = false;
    // this.isNewMessageActive = true;
  }

  setThread() {
    // this.isThreadActive = true;
    // this.isChannelChatActive = true;
    // this.isDirectChatActive = false;
  }


  setDirectChat() {
    console.log('setDirectChat', this.isDirectChatActive);
    console.log('setChannelChat', this.isChannelChatActive);
    console.log('setThread', this.isThreadActive);
    console.log('setMessageChat', this.isNewMessageActive);  
  }

  setChannelChat() {

  }


}
