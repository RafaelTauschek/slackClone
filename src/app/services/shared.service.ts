import { Injectable,  } from '@angular/core';
import { Message } from '../models/message.class';
import { UserService } from './user.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  threadActive: Boolean = false;
  directChatActive: Boolean = false;
  channelChatActive: Boolean = true;
  messageActive: Boolean = false;
  currentPartner: string = '';
  isMobile: boolean = false;
  currentChatPartnerId = new Subject<string>();
  currentChatPartnerId$ = this.currentChatPartnerId.asObservable();
  activeComponent = 'sidebar';

  constructor(private userService: UserService) {}
  

  setCurrentChatPartnerId(id: string) {
    this.currentChatPartnerId.next(id);
    this.currentPartner = id;
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


  public groupMessagesByDate(messages: Message[]) {
    messages.sort((a, b) => a.timestamp - b.timestamp);
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
    const reversedFormatedMessages = new Map([...groupedMessages.entries()].sort().reverse());
    const reversedObject: { [key: string]: Message[] } = {};
    reversedFormatedMessages.forEach((value, key) => {
      reversedObject[key] = value;
    });
    return reversedObject;
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

  public formatTimestampToTime(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  public getKeys(obj: any) {
    return Object.keys(obj);
  }

}
