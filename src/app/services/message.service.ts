import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';
import { ChannelService } from './channel.service';
import { Message } from '../models/message.class';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService implements OnDestroy {
  userSubscription: Subscription;
  channelSubscription: Subscription;
  channel: Channel[] = [];
  user: User[] = [];
  messages: any
  messageSubscription = new BehaviorSubject<Message[]>([]);
  messageSubscription$ = this.messageSubscription.asObservable();

  constructor(private userService: UserService, private channelService: ChannelService, private firebaseService: FirebaseService) {
    this.userSubscription = this.userService.activeUserObservable$.subscribe((activeUser) => {
      this.user = activeUser;
    });
    this.channelSubscription = this.channelService.channelSubscription$.subscribe((channel) => {
      this.channel = channel;
      this.messages = channel[0].messages;
      this.setCurrentMessages(this.messages)
    })
  }


  setCurrentMessages(messages: Message[]) {
    this.messageSubscription.next(messages)
  }

 

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.channelSubscription.unsubscribe();
  }

  sendChannelMessage(newMessage: string) {
    try {
      const date = new Date().getTime();
      const message = new Message({
        senderId: this.user[0].id,
        recieverId: '',
        timestamp: date,
        content: newMessage,
        emojis: [],
        answers: [],
      });
      this.firebaseService.updateMessages('channels', this.channelService.currentChannelId, message.toJSON())
    } catch (err) {
      console.log(err);
    }
    
  }
}
