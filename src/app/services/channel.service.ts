import { Injectable, OnDestroy } from '@angular/core';
import { UserService } from './user.service';
import { Channel } from '../models/channel.class';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../models/user.class';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  channelsSubscription = new BehaviorSubject<Channel[]>([]);
  channelsSubscription$ = this.channelsSubscription.asObservable();
  channelSubscription = new BehaviorSubject<Channel[]>([]);
  channelSubscription$ = this.channelSubscription.asObservable();
  channels: Channel[] = [];
  currentChannelId: string = '';

  constructor(private firebaseService: FirebaseService) {}



  async loadChannels(userId: string) {
    this.channels = [];
    const docSnap = await this.firebaseService.getDocument('users', userId);
    const user = docSnap.data() as User;
    for(const channel of user.channels) {
      const docSnap = await this.firebaseService.getDocument('channels', channel);
      this.channels.push(docSnap.data() as Channel);
      this.setChannels(this.channels);
      this.setChannel([this.channels[0]])
    }
  }



  setSelectedChannel(channelId: string) {
    const channel = this.channelsSubscription.value.find((channel) => channel.id == channelId);
    this.setChannel([channel as Channel]);
  }

  setChannel(channel: Channel[]): void {
    this.channelSubscription.next(channel);
    this.currentChannelId = channel[0].id;
  }

  setChannels(channels: Channel[]): void {
    this.channelsSubscription.next(channels);
    console.log(this.channelSubscription);
  }

}
