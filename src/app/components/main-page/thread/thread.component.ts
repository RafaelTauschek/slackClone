import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ThreadChatComponent } from '../../chats/thread-chat/thread-chat.component';
import { SharedService } from '../../../services/shared.service';
import { ChannelService } from '../../../services/channel.service';
import { Channel } from '../../../models/channel.class';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, ThreadChatComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent implements OnDestroy {
  channel: Channel[] = [];
  channelSubscription: Subscription


  constructor(private sharedService: SharedService, private channelService: ChannelService) {
      this.channelSubscription = this.channelService.channelSubscription$.subscribe((channel) => { 
        this.channel = channel;
      });
  }

  ngOnDestroy(): void {
    this.channelSubscription.unsubscribe();
  }

  closeThread() {
    this.sharedService.closeThread();
  }
}
