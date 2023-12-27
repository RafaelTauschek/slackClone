import { Injectable } from '@angular/core';
import { Message } from '../models/message.class';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  

  constructor(private userService: UserService) {}


  public groupMessagesByDate(messages: Message[]) {
    const groupedMessages = new Map<string, Message[]>();
    messages.forEach((message) => {
      const dateKey = this.formatDate(message.timestamp);
      if (!groupedMessages.has(dateKey)) {
        groupedMessages.set(dateKey, []);
      }
      const messagesArray = groupedMessages.get(dateKey);
      if (messagesArray) {
        messagesArray.push(message);
      }
    });
    return groupedMessages;
  }


  public formatDate(timestamp: number) {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString('de-DE', { weekday: 'long' })}, ${date.toLocaleDateString('de-DE', { month: 'long' })} ${date.getDate()}`;
  }

  public getMessageAlignment(senderId: string) {
    const user = this.userService.activeUser.value;
    const loggedInUserId = user[0].id;
    return senderId === loggedInUserId ? true : false;
  }

  public getKeys(obj: any) {
    return Object.keys(obj);
  }
}
