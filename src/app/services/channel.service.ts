import { Injectable, OnDestroy } from '@angular/core';
import { UserService } from './user.service';
import { Channel } from '../models/channel.class';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../models/user.class';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelService implements OnDestroy {
  channelsSubscription = new BehaviorSubject<Channel[]>([]);
  channelsSubscription$ = this.channelsSubscription.asObservable();
  channelSubscription = new BehaviorSubject<Channel[]>([]);
  channelSubscription$ = this.channelSubscription.asObservable();
  channels: Channel[] = [];
  userSubscription: Subscription;
  user: User[]= [];

  constructor(private firebaseService: FirebaseService, private userService: UserService) {
    this.userSubscription = this.userService.activeUserObservable$.subscribe((activeUser) => {
      if (activeUser) {
        this.user = activeUser;
        this.loadChannels();
        console.log('Channels where loaded', this.channels);
      }

    });
    console.log('User in channelService: ',this.user);
    
  }


  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  async loadChannels() {
    const channels: Channel[] = [];
    this.user[0].channels.forEach(async (id) => {
      const docSnap = await this.firebaseService.getDocument('channels', id);
      channels.push(docSnap.data() as Channel)
    })
    this.setChannels(channels);
    this.setChannel(this.channels[0]);
  }



  setSelectedChannel(channelId: string) {
    const channel = this.channelsSubscription.value.find((channel) => channel.id == channelId);
    this.setChannel(channel);
  }

  setChannel(channel: any): void {
    this.channelSubscription.next(channel);
  }

  setChannels(channels: any): void {
    this.channelsSubscription.next(channels);
    console.log(this.channelSubscription);
  }

}
