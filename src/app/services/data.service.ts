import { Injectable, inject } from '@angular/core';
import { Message } from '../models/message.class';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';
import { Chat } from '../models/chat.class';
import { Firestore } from '@angular/fire/firestore';
import { collection, addDoc, updateDoc, doc, setDoc, getDoc, getDocs, arrayUnion, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

  constructor() { }
  firestore: Firestore = inject(Firestore);
  storage = getStorage();


  getCollectionRef(colId: string) {
    return collection(this.firestore, colId);
  }


  getDocumentRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }


  async addCollection(colId: string, item: {}) {
    const docRef = await addDoc(this.getCollectionRef(colId), item);
    return docRef.id;
  }


  async setDocument(docId: string, colId: string, item: {}) {
    await setDoc(doc(this.getCollectionRef(colId), docId), item);
  }


  async updateDocument(colId: string, docId: string, item: {}) {
    await updateDoc(this.getDocumentRef(colId, docId), item)
  }


  async getDocument(colId: string, docId: string) {
    const docRef = this.getDocumentRef(colId, docId);
    const docSnap = await getDoc(docRef);
    return docSnap;
  }


  async getCollection(colId: string) {
    const docRef = this.getCollectionRef(colId)
    return await getDocs(docRef);
  }

  async updateChats(colId: string, docId: string, item: {}) {
    updateDoc(this.getDocumentRef(colId, docId), {
      chats: arrayUnion(item)
    });
  }



  async updateCollection(colId: string, docId: string, field: string, item: {}) {
    updateDoc(this.getDocumentRef(colId, docId), {
      [field]: arrayUnion(item)
    });
  }


  async uploadFile(file: File): Promise<string> {
    const uniqueFileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(this.storage, uniqueFileName);
    const result = await uploadBytes(storageRef, file);
    return await getDownloadURL(result.ref);
  }


  unsubscribeData() {
    this.unsubscribeUser.unsubscribe();
    this.unsubscribeUsers.unsubscribe();
    this.unsubscribeChats.unsubscribe();
    this.unsubscribeChannels.unsubscribe();
    this.unsubscribeChat.unsubscribe();
    this.unsubscribeChannel.unsubscribe();
  }

  async fetchUserData(userId: string) {
    await this.loadUserData(userId);
    if (this.activeUser && this.activeUser[0]) {
      await Promise.all([
        this.loadUsersData(),
        this.loadChatsData(this.activeUser),
        this.loadChannelsData(this.activeUser)
      ]);
      if (this.activeUser[0].channels) {
        this.setChannel(this.activeUser[0].channels[0]);
      }
    }
  }


  unsubscribeUser: any;
  loadUserData(userId: string): Promise<void> {
    this.activeUser = [];
    return new Promise((resolve) => {
      this.unsubscribeUser = onSnapshot(this.getDocumentRef('users', userId), (user) => {
        this.activeUser.push(user.data() as User);
        resolve();
      });
    });
  }

  unsubscribeUsers: any;



  loadUsersData() {
    this.users = [];
    this.unsubscribeUsers = onSnapshot(this.getCollectionRef('users'), (user) => {
      user.forEach((userData) => {
        this.users.push(userData.data() as User);
      });
    });
  }

  unsubscribeChats: any;


  async loadChatsData(user: User[]) {
    this.chats = [];
    const chats: Chat[] = [];
    for (const chat of user[0].chats) {
      this.unsubscribeChats = onSnapshot(this.getDocumentRef('chats', chat), (docSnap) => {
        const chatData = docSnap.data() as Chat;
        chats.push(chatData as Chat);
      });
      this.chats = chats;
    }
  }

  unsubscribeChat: any;

  async loadChatData(chatId: string) {
    this.unsubscribeChat = onSnapshot(this.getDocumentRef('chats', chatId), (docSnap) => {
      const chatData = docSnap.data() as Chat;
      this.currentChat = [chatData];
      this.formatChat(chatId);
    });
  }






  unsubscribeChannels: any;

  async loadChannelsData(user: User[]) {
    for (const channel of user[0].channels) {
      this.unsubscribeChannels = onSnapshot(this.getDocumentRef('channels', channel), (docSnap) => {
        this.channelList.push(docSnap.data() as Channel);
      });
      const docSnap = await this.getDocument('channels', channel);
      this.channelList.push(docSnap.data() as Channel);
    }
    this.filterChannelList(user[0]);
  }


  unsubscribeChannel: any;

  async loadChannelData(channelId: string) {
    this.unsubscribeChannel = onSnapshot(this.getDocumentRef('channels', channelId), (docSnap) => {
      const channelData = docSnap.data() as Channel;
      this.currentChannel = channelData as Channel;
      this.formatChannel(this.currentChannel);
    });
  }

  formatChannel(channel: Channel) {
    if (channel && channel.messages) {
        channel.messages.sort((a, b) => a.timestamp - b.timestamp);
        const messagesByDate = [];
        let currentDate = null;
        let currentMessages: any[] = [];
        for (const message of channel.messages) {
            const messageDate = new Date(message.timestamp).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
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

  formatChat(chatId: string) {
    this.currentChat = this.chats.filter((chat) => chat.id === chatId);
    if (this.currentChat[0] && this.currentChat[0].messages) {
      this.currentChat[0].messages.sort((a, b) => a.timestamp - b.timestamp);
      const messagesByDate = [];
      let currentDate = null;
      let currentMessages: any[] = [];
      for (const message of this.currentChat[0].messages) {
        const messageDate = new Date(message.timestamp).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });;
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
    } else {
    }
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
    // this.formatChannel(channelId);
   }


  async updateChannelProperties(updatedProperties: Partial<Channel>) {
    const channel = this.currentChannel;
    const newChannel = new Channel({
      ...channel,
      ...updatedProperties
    });
    await this.updateDocument('channels', channel.id, newChannel.toJSON());
    await this.loadChannelsData(this.activeUser);
  }


  async writeChannelMessage(newMessage: string, file: File | null) {
    let fileName = '';
    let fileUrl = '';
    try {
      if (file) {
        fileName = file.name;
        fileUrl = await this.uploadFile(file);
      }
      const message = this.generateNewMessage(newMessage, fileName, fileUrl);
      await this.updateMessages('channels', this.currentChannel.id, message.toJSON());
      this.loadChannelsData(this.activeUser);
      this.loadChannelData(this.currentChannel.id);
    } catch (error) {
      console.error(error);
    }
  }

  async writeChatMessage(message: Message, chatId: string) {
    await this.updateMessages('chats', chatId, message.toJSON());
    await this.loadChatsData(this.activeUser);
    await this.loadChatData(chatId);
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
      fileType: this.determineFileType(fileName) || '',
      fileUrl: fileUrl,
      editMessage: false,
    });
    return message;
  }



  checkIfChatExists(activeUserId: string, chatpartnerId: string) {
    if (activeUserId === chatpartnerId) {
      const chat = this.chats.find(chat =>
        chat.users.includes(activeUserId) && chat.users.length === 1
      );
      return chat ? true : false;
    } else {
      const chat = this.chats.find(chat =>
        chat.users.includes(activeUserId) && chat.users.includes(chatpartnerId) && chat.users.length > 1
      );
      return chat ? true : false;
    }
  }

  getChat(userId: string, chatpartnerId: string) {
    if (userId === chatpartnerId) {
      const chat = this.chats.find(chat =>
        chat.users.includes(userId) && chat.users.length === 1
      );
      return chat ? [chat] : [];
    } else {
      const chat = this.chats.find(chat =>
        chat.users.includes(userId) && chat.users.includes(chatpartnerId) && chat.users.length > 1
      );
      return chat ? [chat] : [];
    }
  }

  async generateFirstChat(userId: string) {
    const chat = new Chat({
      id: '',
      messages: [],
      users: [userId],
    });
    const chatId = await this.addCollection('chats', chat.toJSON());
    chat.id = chatId;
    await this.updateDocument('chats', chatId, chat.toJSON())
    await this.updateChats('users', userId, chatId);
  }


  async generateNewChat(activeUserId: string, chatPartnerId: string, message: Message) {
    if (activeUserId === chatPartnerId) {
      const chat = new Chat({
        id: '',
        messages: [message.toJSON()],
        users: [activeUserId],
      });
      const chatId = await this.addCollection('chats', chat.toJSON());
      chat.id = chatId;
      await this.updateDocument('chats', chatId, chat.toJSON())
      await this.updateMessages('chats', chatId, message.toJSON());
      await this.updateChats('users', activeUserId, chatId);
      this.setCurrentChat([chat]);
    }

    if (activeUserId !== chatPartnerId) {
      const chat = new Chat({
        id: '',
        messages: [message.toJSON()],
        users: [activeUserId, chatPartnerId],
      });
      const chatId = await this.addCollection('chats', chat.toJSON());
      chat.id = chatId;
      await this.updateDocument('chats', chatId, chat.toJSON())
      await this.updateMessages('chats', chatId, message.toJSON());
      await this.updateChats('users', activeUserId, chatId);
      await this.updateChats('users', chatPartnerId, chatId);
      this.setCurrentChat([chat]);
    }
  }

  setCurrentChat(chat: Chat[]) {
    this.formatChat(chat[0].id);
    this.currentChat = chat;
  }


  setCurrentMessage(message: any) {
    this.message = message;
  }


  async updateMessages(colId: string, docId: string, item: {}) {
    updateDoc(this.getDocumentRef(colId, docId), {
      messages: arrayUnion(item)
    });
  }



  async addMessageToChat(chatId: string, newMessage: string, recieverId: string) {
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
    await this.updateMessages('chats', chatId, message.toJSON());
    await this.loadChatsData(this.activeUser);
  }


  getUserProperty(userId: string, property: string) {
    const user = this.users.find(user => user.id === userId);
    if (user && user[property as keyof User]) {
      return user[property as keyof User];
    } else {
      if (property === 'name') {
        return 'deleted User';
      } else {
        return './assets/img/avatars/avatar.png';
      }
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
    if (chat.users.length === 1) {
      return userId;
    } else {
      const chatPartnerId = chat.users.find(user => user !== userId);
      return chatPartnerId;
    }
  }



  async updateUserProperties(updatedProperties: Partial<User>) {
    const user = this.activeUser[0];
    const newUser = new User({
      ...user,
      ...updatedProperties
    });
    await this.updateDocument('users', user.id, newUser.toJSON());
    await this.loadUserData(user.id);
  }


  async addChannelToUsers(users: string[], channelId: string) {
    await Promise.all(users.map(async (user) => {
      const docSnap = await this.getDocument('users', user);
      const userData = docSnap.data() as User;
      const newUser = new User({
        name: userData.name,
        email: userData.email,
        profilepicture: userData.profilepicture,
        channels: [...userData.channels, channelId],
        chats: userData.chats,
        id: userData.id,
      });
      await this.updateDocument('users', userData.id, newUser.toJSON());
      await this.updateChannelUsers({ users: [...this.currentChannel.users, user] }, newUser.id)
    }));
    await this.loadChannelsData(this.activeUser);
    this.loadChannelData(channelId);
  }


  async updateChannelUsers(updatedProperties: Partial<Channel>, userId: string) {
    const channel = this.currentChannel;
    const newChannel = new Channel({
      ...channel,
      ...updatedProperties,
      users: [...channel.users, userId]
    });
    await this.updateDocument('channels', channel.id, newChannel.toJSON());
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
  }


  findChannelIndex(channelId: string) {
    const channelIndex = this.channelList.findIndex((channel) => {
      return channel.id === channelId;
    });
    return channelIndex;
  }



  findMessageIndex(timestamp: number, channel: Channel[]) {
    console.log('timestamp' + timestamp);
    console.log('Channel ' + channel);
    const channelIndex = channel.findIndex((channel) => {
      return channel.messages.some((message) => {
        return message.timestamp === timestamp;
      });
    });
    console.log('Channelindex: ', channelIndex);
    if (channelIndex !== -1) {
      const messageIndex = channel[channelIndex].messages.findIndex((message) => {
        return message.timestamp === timestamp;
      });
      return messageIndex;
    } else {
      return -1;
    }
  }

  findMessageIndexChat(timestamp: number, chat: Chat[]) {
    const chatIndex = chat.findIndex((chat) => {
      return chat.messages.some((message) => {
        return message.timestamp === timestamp;
      });
    });
    if (chatIndex !== -1) {
      const messageIndex = chat[chatIndex].messages.findIndex((message) => {
        return message.timestamp === timestamp;
      });
      return messageIndex;
    } else {
      return -1;
    }
  }


  isPdf(url: string | undefined): boolean {
    if (!url) return false;
    const extension = url.split('?')[0].split('.').pop();
    return extension ? extension === 'pdf' : false;
  }

  isVideo(url: string | undefined): boolean {
    if (!url) return false;
    const extension = url.split('?')[0].split('.').pop();
    return extension ? ['mp4', 'webm', 'ogg'].includes(extension) : false;
  }

  isImage(url: string | undefined): boolean {
    if (!url) return false;
    const extension = url.split('?')[0].split('.').pop();
    return extension ? ['jpeg', 'jpg', 'gif', 'png'].includes(extension) : false;
  }

  determineFileType(fileName: string) {
    if (this.isImage(fileName)) {
      return 'image';
    } else if (this.isPdf(fileName)) {
      return 'pdf';
    } else if (this.isVideo(fileName)) {
      return 'video';
    } else {
      return 'unknown';
    }
  }



  async editMessage(message: Message, type: 'chat' | 'channel') {
    const current = type === 'chat' ? this.currentChat[0] : this.currentChannel;
    const messageIndex = this.findMessageIndex(message.timestamp, [current] as unknown as Channel[]);
    const newMessageData = this.generateMessage(message);
    const doc = await this.getDocument(type + 's', current.id);
    const docData = doc.data();
    if (docData) {
      docData['messages'][messageIndex] = newMessageData.toJSON();
      this.updateDocument(type + 's', current.id, docData);
      if (type === 'chat') {
        this.loadChatsData(this.activeUser);
      } else {
        this.loadChannelData(current.id);
      }
    }
  }





  generateMessage(message: Message) {
    const newMessage = new Message({
      senderId: message.senderId,
      recieverId: message.recieverId,
      timestamp: message.timestamp,
      emojis: message.emojis,
      answers: message.answers,
      fileName: message.fileName,
      fileUrl: message.fileUrl,
      fileType: message.fileType,
      content: message.content,
      editMessage: false,
    });
    return newMessage;
  }


  async editChatMessage(message: Message, newMessage: string) {
    const messageIndex = this.findMessageIndexChat(message.timestamp, [this.currentChat[0]] as unknown as Chat[]);
    const newMessageData = new Message({
      senderId: message.senderId,
      recieverId: message.recieverId,
      timestamp: message.timestamp,
      emojis: message.emojis,
      answers: message.answers,
      fileName: message.fileName,
      fileUrl: message.fileUrl,
      fileType: message.fileType,
      content: newMessage,
      editMessage: false,
    });
    const doc = await this.getDocument('chats', this.currentChat[0].id);
    const docData = doc.data();
    if (docData) {
      docData['messages'][messageIndex] = newMessageData.toJSON();
      await this.updateDocument('chats', this.currentChat[0].id, docData);
      await this.loadChatsData(this.activeUser);
      await this.loadChatData(this.currentChat[0].id);
    }
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
      fileType: message.fileType,
      content: newMessage,
      editMessage: false,
    });
    const doc = await this.getDocument('channels', this.currentChannel.id);
    const docData = doc.data();
    if (docData) {
      docData['messages'][messageIndex] = newMessageData.toJSON();
      await this.updateDocument('channels', this.currentChannel.id, docData);
      await this.loadChannelsData(this.activeUser);
      this.loadChannelData(this.currentChannel.id);
    }
  }

  async editThreadMessage(parentMessage: Message, threadMessage: Message, newMessage: string) {
    const parentMessageIndex = this.findMessageIndex(parentMessage.timestamp, [this.currentChannel] as Channel[]);
    const threadMessageIndex = parentMessage.answers.findIndex(answer => answer.timestamp === threadMessage.timestamp);
    const newMessageData = new Message({
      senderId: threadMessage.senderId,
      recieverId: threadMessage.recieverId,
      timestamp: threadMessage.timestamp,
      emojis: threadMessage.emojis,
      answers: threadMessage.answers,
      fileName: threadMessage.fileName,
      fileUrl: threadMessage.fileUrl,
      fileType: threadMessage.fileType,
      content: newMessage,
      editMessage: false,
    });
    const doc = await this.getDocument('channels', this.currentChannel.id);
    const docData = doc.data();
    if (docData) {
      docData['messages'][parentMessageIndex].answers[threadMessageIndex] = newMessageData.toJSON();
      this.setCurrentMessage([docData['messages'][parentMessageIndex]]);
      await this.updateDocument('channels', this.currentChannel.id, docData);
      await this.loadChannelsData(this.activeUser);
      this.setChannel(this.currentChannel.id);
    }
  }


  async editThreadEmoji(parentMessage: Message, threadMessage: Message) {
    const parentMessageIndex = this.findMessageIndex(parentMessage.timestamp, [this.currentChannel] as Channel[]);
    const threadMessageIndex = parentMessage.answers.findIndex(answer => answer.timestamp === threadMessage.timestamp);
    const newMessageData = new Message({
      senderId: threadMessage.senderId,
      recieverId: threadMessage.recieverId,
      timestamp: threadMessage.timestamp,
      emojis: threadMessage.emojis,
      answers: threadMessage.answers,
      fileName: threadMessage.fileName,
      fileUrl: threadMessage.fileUrl,
      fileType: threadMessage.fileType,
      content: threadMessage.content,
      editMessage: false,
    });
    const doc = await this.getDocument('channels', this.currentChannel.id);
    const docData = doc.data();
    if (docData) {
      docData['messages'][parentMessageIndex].answers[threadMessageIndex] = newMessageData.toJSON();
      await this.updateDocument('channels', this.currentChannel.id, docData);
      await this.loadChannelsData(this.activeUser);
      this.setChannel(this.currentChannel.id);
    }
  }
}
