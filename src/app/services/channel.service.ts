import { Injectable, OnDestroy } from '@angular/core';
import { UserService } from './user.service';
import { Channel } from '../models/channel.class';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelService implements OnDestroy {
  channels: Channel[] = []
  channelSubscription = new BehaviorSubject<Channel[]>([]);
  channelSubscription$ = this.channelSubscription.asObservable();

  constructor(private userService: UserService) { }


  loadChannels(userId: string) {
    
  }

  setChannels(channel: Channel): void {
    this.channelSubscription.next([channel]);
  }

  ngOnDestroy(): void {
    
  }
}
