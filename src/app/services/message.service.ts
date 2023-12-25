import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';
import { ChannelService } from './channel.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService implements OnDestroy {
  channelSubscription: Subscription;
  channel: Channel[] = [];
  activeUserSubscription: Subscription;
  activeUser: User[] = []

  constructor(private userService: UserService, private channelService: ChannelService) {
    this.activeUserSubscription = this.userService.activeUserObservable$.subscribe((activeUser) => {
      this.activeUser = activeUser;
    });
    this.channelSubscription = this.channelService.channelSubscription$.subscribe((channel) => {
      this.channel = channel;
    })
  }



  ngOnDestroy(): void {
    this.activeUserSubscription.unsubscribe();
    this.channelSubscription.unsubscribe();
  }
}
