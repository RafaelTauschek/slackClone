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
    if (docSnap.exists()) {
      const user = docSnap.data() as User;
      for(const channel of user.channels) {
        const docSnap = await this.firebaseService.getDocument('channels', channel);
        this.channels.push(docSnap.data() as Channel);
        this.setChannels(this.channels);
        this.setChannel([this.channels[0]])
      }
    } else {
      console.log('No Channel available for the user');
    }
  }

  async updateChannel(channelId: string) {
    const docSnap = await this.firebaseService.getDocument('channels', channelId);
    const channel = docSnap.data() as Channel;
    this.channels.push(channel);
    this.setChannels(this.channels);
    this.setChannel([channel]);
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
  }

  

  async editChannelName(newChannelName: string) {
    const channel = this.channelSubscription.value[0];
    const newChannel = new Channel({
      name: newChannelName,
      description: channel.description,
      creator: channel.creator,
      id: channel.id,
      messages: channel.messages,
      creationDate: channel.creationDate,
    });
    await this.firebaseService.updateDocument('channels', channel.id, newChannel.toJSON());
    await this.updateChannel(channel.id);
  }

  async editChannelDescription(newChannelDescription: string) {
    const channel = this.channelSubscription.value[0];
    const newChannel = new Channel({
      name: channel.name,
      description: newChannelDescription,
      creator: channel.creator,
      id: channel.id,
      messages: channel.messages,
      creationDate: channel.creationDate,
    });
    await this.firebaseService.updateDocument('channels', channel.id, newChannel.toJSON());
    await this.updateChannel(channel.id);
  }



}
