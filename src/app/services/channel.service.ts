import { Injectable, OnDestroy, ɵsetAllowDuplicateNgModuleIdsForTest } from '@angular/core';
import { UserService } from './user.service';
import { Channel } from '../models/channel.class';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User } from '../models/user.class';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelService implements OnDestroy {
  //channels: Channel[] = []
  channelsSubscription = new BehaviorSubject<Channel[]>([]);
  channelsSubscription$ = this.channelsSubscription.asObservable();
  channelSubscription = new BehaviorSubject<Channel[]>([]);
  channelSubscription$ = this.channelSubscription.asObservable();

  currentUserSubscription: Subscription;
  currentUser: User[] = []
  

  constructor(private userService: UserService, private firebaseService: FirebaseService) {
    this.currentUserSubscription = this.userService.activeUserObservable$.subscribe((activeUser) => {
      this.currentUser = activeUser;
    });
  }



  async loadChannels() {
    const channels: Channel[] = []
    this.currentUser[0].channels.forEach(async (id) => {
      const docSnap = await this.firebaseService.getDocument('channels', id);
      channels.push(docSnap.data() as Channel);
    });
    this.setChannels(channels);
    this.setChannel(channels[0]);
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
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
    }
}
