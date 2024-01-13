import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';
import { ChannelService } from './channel.service';
import { Message } from '../models/message.class';
import { FirebaseService } from './firebase.service';
import { Chat } from '../models/chat.class';
import { StorageService } from './storage.service';
import { SharedService } from './shared.service';

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
  chatsSubscription = new BehaviorSubject<Chat[]>([]);
  chatsSubscription$ = this.chatsSubscription.asObservable();
  chatSubscription = new BehaviorSubject<Chat[]>([]);
  chatSubscription$ = this.chatSubscription.asObservable();


  constructor(private userService: UserService, private channelService: ChannelService,
    private firebaseService: FirebaseService, private storageService: StorageService, private sharedService: SharedService) {
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
    const chats = [];
    const docSnap = await this.firebaseService.getDocument('users', userId);
    if (docSnap.exists()) {
      const user = docSnap.data() as User;
      for (const chat of user.chats) {
        const docSnap = await this.firebaseService.getDocument('chats', chat);
        chats.push(docSnap.data() as Chat);
      }
      this.setChats(chats);
    } else {
      console.log('No Chats available for the user');
    }
  }


  checkIfChatExists(activeUserId: string, chatpartnerId: string) {
    console.log('Checking if chat exists')
    console.log('Active User Id: ' + activeUserId);
    console.log('Chatpartner Id: ' + chatpartnerId);
    const chat = this.chatsSubscription.value.find((chat) => chat.users.includes(activeUserId) && chat.users.includes(chatpartnerId));
    console.log('Chat: ' + chat);
    if (chat) {
      return chat;
    } else {
      return false;
    }
  }


  async generateNewChat(activeUserId: string, chatPartnerId: string, newMessage: any) {
    const date = new Date().getTime();
    const chat = new Chat({
      chatId: '',
      messages: [],
      users: [activeUserId, chatPartnerId],
    });
    const chatId = await this.firebaseService.addCollection('chats', chat.toJSON());
    chat.chatId = chatId;
    await this.firebaseService.updateDocument('chats', chatId, chat.toJSON())
    const message = new Message({
      senderId: activeUserId,
      recieverId: chatPartnerId,
      timestamp: date,
      content: newMessage,
      emojis: [],
      answers: [],
      fileName: '',
      fileUrl: '',
      editMessage: false,
    });
    await this.firebaseService.updateMessages('chats', chatId, message.toJSON());
    await this.firebaseService.updateChats('users', activeUserId, chatId);
    await this.firebaseService.updateChats('users', chatPartnerId, chatId);
  }


  async updateChatMessages(chatId: string) {
    const docSnap = await this.firebaseService.getDocument('chats', chatId);
    const chat = docSnap.data() as Chat;
    this.setCurrentChat([chat]);
  }


  setChats(chats: Chat[]) {
    this.chatsSubscription.next(chats);
  }

  setCurrentChat(chat: Chat[]) {
    this.chatSubscription.next(chat);
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


  async addMessageToChat(chatId: string, newMessage: any, recieverId: string) {
    const date = new Date().getTime();
    const message = new Message({
      senderId: this.user[0].id,
      recieverId: recieverId,
      timestamp: date,
      content: newMessage,
      emojis: [],
      answers: [],
      fileName: '',
      fileUrl: '',
      editMessage: false,
    });
    await this.firebaseService.updateMessages('chats', chatId, message.toJSON());
    await this.updateChatMessages(chatId);
  }




  async sendChannelMessage(newMessage: string, file: File | null) {
    let fileName = '';
    let fileUrl = '';
    try {
      if (file) {
        fileName = file.name;
        fileUrl = await this.storageService.uploadFile(file);
      }
      const message = this.generateNewMessage(newMessage, fileName, fileUrl);
      await this.firebaseService.updateMessages('channels', this.channelService.currentChannelId, message.toJSON())
      await this.channelService.updateChannel(this.channelService.currentChannelId);
    }
    catch (err) {
      console.log(err);
    }
  }

  generateNewMessage(newMessage: string, fileName: string, fileUrl: string) {
    const date = new Date().getTime();
    const message = new Message({
      senderId: this.user[0].id,
      recieverId: '',
      timestamp: date,
      content: newMessage,
      emojis: [],
      answers: [],
      fileName: fileName,
      fileUrl: fileUrl,
      fileType: this.determineFileType(fileName),
      editMessage: false,
    });
    return message;
  }

  determineFileType(fileName: string) {
    if (this.sharedService.isImage(fileName)) {
      return 'image';
    } else if (this.sharedService.isPdf(fileName)) {
      return 'pdf';
    } else if (this.sharedService.isVideo(fileName)) {
      return 'video';
    } else {
      return 'unknown';
    }
  }


}
