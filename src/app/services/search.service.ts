import { Injectable } from '@angular/core';
import { Channel } from '../models/channel.class';
import { Message } from '../models/message.class';
import { User } from '../models/user.class';
import { Chat } from '../models/chat.class';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() {}


  filterChannels(channels: Channel[], searchTerm: string) {
    const searchedChannel: Channel[] = [];
    channels.forEach((channel: Channel) => {
      if (channel.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        searchedChannel.push(channel);
      }
    });
    return searchedChannel;
  }


  filterUsers(users: User[], searchTerm: string) {
    const searchedUser: User[] = [];
    users.forEach((user: User) => {
      if (user.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        searchedUser.push(user);
      }
    });
    return searchedUser;
  }


  filterDirectMessages(chats: Chat[], searchTerm: string) {
    const searchedDirectMessages: Message[] = [];
    chats.forEach((chat: Chat) => {
      chat.messages.forEach((message: Message) => {
        if (message.content.toLowerCase().includes(searchTerm.toLowerCase())) {
          searchedDirectMessages.push(message);
        }
      });
    });
    return searchedDirectMessages;
  }


  filterChannelMessages(channels: Channel[], searchTerm: string) {
    console.log(channels);
    const searchedChannelMessages: { message: Message, channel: Channel }[] = [];
    channels.forEach(channel => {
      if (channel.messages && Array.isArray(channel.messages)) {
        channel.messages.forEach(message => {
          if (message.content.toLowerCase().includes(searchTerm.toLowerCase())) {
            searchedChannelMessages.push({ message: message, channel: channel });
          }
        });
      }
    });
    return searchedChannelMessages;
  }
}
