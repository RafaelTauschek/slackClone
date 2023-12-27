import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ChatAreaComponent } from '../chat-area/chat-area.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { Subscription } from 'rxjs';
import { Channel } from '../../../models/channel.class';
import { ChannelService } from '../../../services/channel.service';

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [CommonModule, ChatAreaComponent, RouterOutlet, RouterModule, PickerComponent],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss'
})
export class ChannelChatComponent implements OnDestroy {
  channelSubscription: Subscription;
  channel: Channel[] = []

  constructor(private channelService: ChannelService) {
    this.channelSubscription = this.channelService.channelSubscription.subscribe((channel) => {
      this.channel = channel;
    });
  }



  addEmoji(event: Event) {
    console.log('Event activated: ', event);
  }

  ngOnDestroy(): void {
    this.channelSubscription.unsubscribe();
  }
}
