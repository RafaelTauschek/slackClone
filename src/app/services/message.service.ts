import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';
import { ChannelService } from './channel.service';
import { Message } from '../models/message.class';
import { FirebaseService } from './firebase.service';
import { Chat } from '../models/chat.class';

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
  singleMessageSubscription = new BehaviorSubject<Message[]>([]);
  singleMessageSubscription$ = this.singleMessageSubscription.asObservable();
  chats: Chat[] = [];
  chatSubscription = new BehaviorSubject<Chat[]>([]);
  chatSubscription$ = this.chatSubscription.asObservable();


  constructor(private userService: UserService, private channelService: ChannelService, private firebaseService: FirebaseService) {
    this.userSubscription = this.userService.activeUserObservable$.subscribe((activeUser) => {
      this.user = activeUser;
    });
    this.channelSubscription = this.channelService.channelSubscription$.subscribe((channel) => {
      if (channel && channel.length > 0 && channel[0].messages) {
        this.channel = channel;
        this.messages = channel[0].messages;
        this.setCurrentMessages(this.messages);
      }
    })
  }


  async loadChats(userId: string) {
    this.chats = [];
    const docSnap = await this.firebaseService.getDocument('users', userId);
    if (docSnap.exists()) {
      const user = docSnap.data() as User;
      for(const chat of user.chats) {
        const docSnap = await this.firebaseService.getDocument('chats', chat);
        this.chats.push(docSnap.data() as Chat);
      }
      this.setChats(this.chats);
    } else {
      console.log('No Chats available for the user');
    }
  }


  checkIfChatExists(activeUserId: string, chatpartnerId: string) {
    const users = this.userService.availableUsers;
    const user = users.find(user => user.id === activeUserId);
    const chat = user?.chats.find(chat => chat === chatpartnerId);
    console.log(user, chat);
  }

  async generateNewChat(activeUserId: string, chatPartnerId: string, newMessage: any) {
    const date = new Date().getTime();
    const chat =  new Chat({
      chatId: '',
      messages: [],
      users: [activeUserId, chatPartnerId],
    });
    const chatId = await this.firebaseService.addCollection('chats', chat.toJSON());
    chat.chatId = chatId;
    await this.firebaseService.updateDocument('chats', chatId, chat.toJSON())
    const message = new Message ({
      senderId: activeUserId,
      recieverId: chatPartnerId,
      timestamp: date,
      content: newMessage,
      emojis: [],
      answers: [],
    });
    await this.firebaseService.updateMessages('chats', chatId, message.toJSON());
    await this.firebaseService.updateChats('users', activeUserId, chatId);
    await this.firebaseService.updateChats('users', chatPartnerId, chatId);
  }

  setChats(chats: Chat[]) {
    this.chatSubscription.next(chats);
  }

  setCurrentMessage(message: Message[]) {
    this.singleMessageSubscription.next(message)
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
