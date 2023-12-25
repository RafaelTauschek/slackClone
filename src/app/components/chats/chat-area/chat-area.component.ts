import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Channel } from '../../../models/channel.class';
import { ChannelService } from '../../../services/channel.service';


@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [],
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.scss'
})
export class ChatAreaComponent implements OnDestroy {
  channel: Channel[]= [];
  channelSubscription: Subscription;

  constructor(private channelService: ChannelService){
    this.channelSubscription = this.channelService.channelSubscription$.subscribe((channel) => {
      this.channel = channel
    })
  }

  ngOnDestroy(): void {
    this.channelSubscription.unsubscribe();
  }

}
