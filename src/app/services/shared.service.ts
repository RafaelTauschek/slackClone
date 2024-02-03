import { Injectable, ViewChild,  } from '@angular/core';
import { Message } from '../models/message.class';
import { Subject } from 'rxjs';
import { UserDataService } from './data.service';
import { User } from '../models/user.class';
import { Chat } from '../models/chat.class';
import { Channel } from '../models/channel.class';
import { FirebaseService } from './firebase.service';
import { ChatAreaComponent } from '../components/chats/chat-area/chat-area.component';

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
  isTablet: boolean = false;
  popupActive: boolean = false;
  registeredPopup: boolean = false;
  mailPopup: boolean = false;
  loginPopup: boolean = false;
  activeComponent = 'sidebar';
  changeWidth = 'calc(100% - 48px)';
  constructor(private data: UserDataService, private firebaseService: FirebaseService) {}
  
  setCurrentChatPartnerId(id: string) {
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



  public formatDate(timestamp: number) {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString('de-DE', { weekday: 'long' })}, ${date.toLocaleDateString('de-DE', { month: 'long' })} ${date.getDate()}`;
  }

  public getMessageAlignment(senderId: string) {
    const loggedInUserId = this.data.activeUser[0].id;
    return senderId === loggedInUserId ? true : false;
  }

  public formatTimestampToTime(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }



   getUserProperty(userId: string, property: string) {
     const user = this.data.users.find((user: User) => user.id === userId);
     if (user && user[property as keyof User]) {
       return user[property as keyof User];
     } else {
       return 'deleted User';
     }
   }


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
        if (user.id !== this.data.activeUser[0].id) {
          searchedUser.push(user);
        }
       }
     });
     return searchedUser;
   }


 filterUsersByMail(users: User[], searchTerm: string) {
   const searchedUser: User[] = [];
   users.forEach((user: User) => {
     if (user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
       searchedUser.push(user);
     }
   });
   return searchedUser;
 }

 

 generateNewMessage(newMessage: string, fileName: string, fileUrl: string) {
  const date = new Date().getTime();
  const message = new Message({
    senderId: this.data.activeUser[0].id,
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

 filterDirectMessages(chats: Chat[], searchTerm: string) {
   const searchedDirectMessages: Message[] = [];
   chats.forEach((chat: Chat) => {
     chat.messages.forEach((message: Message) => {
       if (message.content.toLowerCase().includes(searchTerm.toLowerCase()) && message.senderId !== this.data.activeUser[0].id) {
         searchedDirectMessages.push(message);
       }
     });
   });
   return searchedDirectMessages;
 }


   filterChannelMessages(channels: Channel[], searchTerm: string) {
     const searchedChannelMessages: { message: Message, channel: Channel }[] = [];
     channels.forEach(channel => {
       if (channel.messages && Array.isArray(channel.messages)) {
         channel.messages.forEach(message => {
           if (message.content.toLowerCase().includes(searchTerm.toLowerCase()) && message.senderId !== this.data.activeUser[0].id) {
             searchedChannelMessages.push({ message: message, channel: channel });
           }
         });
       }
     });
     return searchedChannelMessages;
   }
   



   async sendChannelMessage(newMessage: string, file: File | null) {
    let fileName = '';
    let fileUrl = '';
    try {
      if (file) {
        fileName = file.name;
        fileUrl = await this.firebaseService.uploadFile(file);   
      }
      const message = this.generateNewMessage(newMessage, fileName, fileUrl);
      await this.firebaseService.updateMessages('channels', this.data.currentChannel.id, message.toJSON());
      this.openChannel(this.data.currentChannel);
    }
    catch (err) {
      console.error(err);
    }
  }

  private triggerScrollTo = new Subject<{ dayIndex: number, messageIndex: number }>();
  triggerScrollTo$ = this.triggerScrollTo.asObservable();

  scrollIntoView(dayIndex: number, messageIndex: number) {
    this.triggerScrollTo.next({ dayIndex, messageIndex });
  }


  
  openChannel(channel: Channel) {
    this.data.setChannel(channel);
    if (this.isMobile) {
      this.activeComponent = 'channel-chat';
    }
    this.messageActive = false;
    this.directChatActive = false;
    this.channelChatActive = true;
  }


}
