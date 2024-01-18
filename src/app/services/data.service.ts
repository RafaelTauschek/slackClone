import { Injectable } from '@angular/core';
import { Message } from '../models/message.class';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';
import { Chat } from '../models/chat.class';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  message: Message[] = [];
  chatpartnerId: string = '';
  activeUser: User[] = [];
  users: User[] = [];
  channelList: Channel[] = [];
  userChannels: Channel[] = [];
  chats: Chat[] = [];
  currentChat: Chat[] = [];
  currentChannel: Channel = {} as Channel;

  constructor(private firebase: FirebaseService) {}


  async fetchUserData(userId: string) {
    await this.loadUserData(userId);
    await Promise.all([
      this.loadUsersData(),
      this.loadChatsData(this.activeUser[0]),
      this.loadChannelData(this.activeUser)
    ]);
    this.setChannel(this.activeUser[0].channels[0]);
  }


  async loadUserData(userId: string) {
    const docSnap = await this.firebase.getDocument('users', userId);
    const user = docSnap.data() as User;
    this.activeUser = [user];
  } 


  async loadUsersData() {
    this.users = [];
    await this.firebase.getCollection('users').then((user) => {
      user.forEach((userData) => {
        this.users.push(userData.data() as User);
      });
    })
  }

  async loadChatsData(user: User) {
    const chats = [];
    for (const chat of user.chats) {
      const docSnap = await this.firebase.getDocument('chats', chat);
      chats.push(docSnap.data() as Chat);
    }
    this.chats = chats;
  }

  async loadChannelData(user: User[]) {
    this.channelList = [];
    if (user[0].channels) {
      for(const channel of user[0].channels) {
        const docSnap = await this.firebase.getDocument('channels', channel);
        this.channelList.push(docSnap.data() as Channel);
      }
    }
    this.filterChannelList(user[0]);
  }

  filterChannelList(user: User) {
    this.userChannels = [];
    if (user.channels) {
      for(const channel of user.channels) {
        const docSnap = this.channelList.find((channelList) => channelList.id === channel);
        if (docSnap) {
          this.userChannels.push(docSnap);
        }
      }
    }
  }

  setChannel(channelId: string) {
    if (channelId) {
      this.currentChannel = this.userChannels.find((channel) => channel.id === channelId) as Channel;
    } else {
      this.currentChannel = this.userChannels[0] || null;
    }
    console.log(this.currentChannel);
  }



}
