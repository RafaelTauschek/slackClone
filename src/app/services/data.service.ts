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
  message: any = [];
  chatpartnerId: string = '';
  activeUser: User[] = [];
  users: User[] = [];
  channelList: Channel[] = [];
  userChannels: Channel[] = [];
  chats: Chat[] = [];
  currentChat: Chat[] = [];
  currentChannel: Channel = {} as Channel;
  messages: any[] = [];

  constructor(private firebase: FirebaseService) { }


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
      for (const channel of user[0].channels) {
        const docSnap = await this.firebase.getDocument('channels', channel);
        this.channelList.push(docSnap.data() as Channel);
      }
    }
    this.filterChannelList(user[0]);
  }


  filterChannelList(user: User) {
    this.userChannels = [];
    if (user.channels) {
      for (const channel of user.channels) {
        const docSnap = this.channelList.find((channelList) => channelList.id === channel);
        if (docSnap) {
          this.userChannels.push(docSnap);
          this.sortChannelList(this.userChannels);
        }
      }
    }
  }


  sortChannelList(channel: Channel[]) {
    let sortedChannelList = channel.sort((a, b) => a.name.localeCompare(b.name));
    this.userChannels = sortedChannelList;
  }


  setChannel(channelId: string) {
    this.currentChannel = this.userChannels.find((channel) => channel.id === channelId) as Channel;
    this.formatChannel(channelId);
  }


  formatChannel(channelId: string) {
    this.currentChannel = this.userChannels.find((channel) => channel.id === channelId) as Channel;
    if (this.currentChannel && this.currentChannel.messages) {
      this.currentChannel.messages.sort((a, b) => a.timestamp - b.timestamp);
      const messagesByDate = [];
      let currentDate = null;
      let currentMessages: any[] = [];
      for (const message of this.currentChannel.messages) {
        const messageDate = new Date(message.timestamp).toDateString();
        if (messageDate !== currentDate) {
          if (currentDate !== null) {
            messagesByDate.push({ date: currentDate, messages: currentMessages });
          }
          currentDate = messageDate;
          currentMessages = [message];
        } else {
          currentMessages.push(message);
        }
      }
      if (currentMessages.length > 0) {
        messagesByDate.push({ date: currentDate, messages: currentMessages });
      }
      this.messages = messagesByDate;
    }
  }


  async updateChannelProperties(updatedProperties: Partial<Channel>) {
    const channel = this.currentChannel;
    const newChannel = new Channel({
      ...channel,
      ...updatedProperties
    });
    await this.firebase.updateDocument('channels', channel.id, newChannel.toJSON());
    await this.loadChannelData(this.activeUser);
  }


  async writeChannelMessage(newMessage: string, file: File | null) {
    let fileName = '';
    let fileUrl = '';
    try {
      if (file) {
        fileName = file.name;
        fileUrl = await this.firebase.uploadFile(file);
      }
      const message = this.generateNewMessage(newMessage, fileName, fileUrl);
      await this.firebase.updateMessages('channels', this.currentChannel.id, message.toJSON());
      await this.loadChannelData(this.activeUser);
    } catch (error) {
      console.log(error);
    }
  }

  generateNewMessage(newMessage: string, fileName: string, fileUrl: string) {
    const date = new Date().getTime();
    const message = new Message({
      senderId: this.activeUser[0].id,
      recieverId: '',
      timestamp: date,
      content: newMessage,
      emojis: [],
      answers: [],
      fileName: fileName,
      fileUrl: fileUrl,
      editMessage: false,
    });
    return message;
  }
  

  checkIfChatExists(activeUserId: string, chatpartnerId: string) {
    const chat = this.currentChat;
    if (chat) {
      return chat;
    } else {
      return false;
    }
  }


  async generateFirstChat(userId: string) {
    const chat = new Chat({
      chatId: '',
      messages: [],
      users: [userId],
    });
    const chatId = await this.firebase.addCollection('chats', chat.toJSON());
    chat.chatId = chatId;
    await this.firebase.updateDocument('chats', chatId, chat.toJSON())
    await this.firebase.updateChats('users', userId, chatId);
  }


  async generateNewChat(activeUserId: string, chatPartnerId: string, newMessage: any) {
    const date = new Date().getTime();
    const chat = new Chat({
      chatId: '',
      messages: [],
      users: [activeUserId, chatPartnerId],
    });
    const chatId = await this.firebase.addCollection('chats', chat.toJSON());
    chat.chatId = chatId;
    await this.firebase.updateDocument('chats', chatId, chat.toJSON())
    const message = new Message({
      senderId: activeUserId,
      recieverId: chatPartnerId,
      timestamp: date,
      content: newMessage,
      emojis: [],
      answers: [],
      fileName: '',
      fileUrl: '',
      fileType: '',
      editMessage: false,
    });
    await this.firebase.updateMessages('chats', chatId, message.toJSON());
    await this.firebase.updateChats('users', activeUserId, chatId);
    await this.firebase.updateChats('users', chatPartnerId, chatId);
  }


  async updateChatMessages(chatId: string) {
    const docSnap = await this.firebase.getDocument('chats', chatId);
    const chat = docSnap.data() as Chat;
    this.currentChat = [chat];
    this.setCurrentChat([chat]);
  }


  setCurrentChat(chat: Chat[]) {
    this.currentChat = chat;
  }


  setCurrentMessage(message: Message[]) {
    this.message = message;
  }


  async addMessageToChat(chatId: string, newMessage: any, recieverId: string) {
    const date = new Date().getTime();
    const message = new Message({
      senderId: this.activeUser[0].id,
      recieverId: recieverId,
      timestamp: date,
      content: newMessage,
      emojis: [],
      answers: [],
      fileName: '',
      fileUrl: '',
      fileType: '',
      editMessage: false,
    });
    await this.firebase.updateMessages('chats', chatId, message.toJSON());
    await this.updateChatMessages(chatId);
  }


  getUserProperty(userId: string, property: string) {
    const user = this.users.find(user => user.id === userId);
    if (user && user[property as keyof User]) {
      return user[property as keyof User];
    } else {
      return 'deleted User';
    }
  }


  getProfilePictureURL(userId: string): string {
    const userProfilePicture = this.getUserProperty(userId, 'profilepicture');
    if (typeof userProfilePicture === 'string' && userProfilePicture.startsWith('http')) {
      return userProfilePicture;
    } else {
      return './assets/img/avatars/' + userProfilePicture + '.png';
    }
  }


  getInitials() {
    const user = this.activeUser[0];
    const name = user.name.split(' ');
    const initials = name[0].charAt(0).toUpperCase() + '.' + name[name.length - 1].charAt(0).toUpperCase() + '.';
    return initials;
  }


  getChatPartnerId(chat: Chat, userId: string) {
    const chatPartnerId = chat.users.find(user => user !== userId);
    return chatPartnerId;
  }


  async updateUserProperties(updatedProperties: Partial<User>) {
    const user = this.activeUser[0];
    const newUser = new User({
      ...user,
      ...updatedProperties
    });
    await this.firebase.updateDocument('users', user.id, newUser.toJSON());
  }


  async addChannelToUsers(users: string[], channelId: string) {
    users.forEach(async (user) => {
      const docSnap = await this.firebase.getDocument('users', user);
      const userData = docSnap.data() as User;
      const newUser = new User({
        name: userData.name,
        email: userData.email,
        profilepicture: userData.profilepicture,
        channels: [...userData.channels, channelId],
        chats: userData.chats,
        id: userData.id,
      });
      await this.firebase.updateDocument('users', userData.id, newUser.toJSON());
    })
  }

  async leaveChannel(userId: string, channel: Channel) {
    const newChannel = channel.users.filter((user) => user !== userId);
    const newChannelData = new Channel({
      ...channel,
      users: newChannel,
    });
    await this.updateChannelProperties(newChannelData);
    await this.removeChannelFromUser(channel.id);
  }

  async removeChannelFromUser(channelId: string) {
    const user = this.activeUser[0];
    const newUser = new User({
      ...user,
      channels: user.channels.filter((channel) => channel !== channelId),
    });
    await this.updateUserProperties(newUser);
    await this.loadUserData(user.id);
    await this.loadChannelData(this.activeUser);
  }

  async editChannelMessage(message: Message, newMessage: string) {
    const messageIndex = this.findMessageIndex(message.timestamp, [this.currentChannel] as Channel[]);
    const newMessageData = new Message({
      senderId: message.senderId,
      recieverId: message.recieverId,
      timestamp: message.timestamp,
      emojis: message.emojis,
      answers: message.answers,
      fileName: message.fileName,
      fileUrl: message.fileUrl,
      content: newMessage,
      editMessage: false,
    });
    const doc = await this.firebase.getDocument('channels', this.currentChannel.id);
    const docData = doc.data();
    if (docData) {
      docData['messages'][messageIndex] = newMessageData.toJSON();
      await this.firebase.updateDocument('channels', this.currentChannel.id, docData);
      await this.loadChannelData(this.activeUser);
      this.setChannel(this.currentChannel.id);
    }
  }

  findChannelIndex(channelId: string) {
    const channelIndex = this.channelList.findIndex((channel) => {
      return channel.id === channelId;
    });
    return channelIndex;
  }

  findMessageIndex(timestamp: number, channel: Channel[]) {
    const channelIndex = channel.findIndex((channel) => {
      return channel.messages.some((message) => {
        return message.timestamp === timestamp;
      });
    });
    if (channelIndex !== -1) {
      const messageIndex = channel[channelIndex].messages.findIndex((message) => {
        return message.timestamp === timestamp;
      });
      return messageIndex;
    } else {
      return -1;
    }
  }

}
