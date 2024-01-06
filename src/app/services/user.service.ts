import { Injectable } from '@angular/core';
import { User } from '../models/user.class';
import { FirebaseService } from './firebase.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Channel } from '../models/channel.class';
import { ChannelService } from './channel.service';
import { Chat } from '../models/chat.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  activeUser = new BehaviorSubject<User[]>([]);
  activeUserObservable$ = this.activeUser.asObservable();
  availableUsers: User[] = []
  users = new BehaviorSubject<User[]>([]); 
  usersObservable$ = this.users.asObservable(); 


  constructor(private firebaseService: FirebaseService) {
    this.loadAvailableUsers();
  }



  setUsers() {
    this.users.next(this.availableUsers);
  }

  getUserName(userId: string) {
    const user = this.availableUsers.find(user => user.id === userId);
    if (user) {
      return user.name;  
    } else {
      return 'deleted User';
    }
  }


  getUserMail(userId: string) {
    const user = this.availableUsers.find(user => user.id === userId);
    if (user) {
      return user.email;  
    } else {
      return 'deleted User';
    } 
  }

  getUserProfilePicture(userId: string) {
    const user = this.availableUsers.find(user => user.id === userId);
    if (user) {
      return user.profilepicture;  
    } else {
      return 'deleted User';
    }   
  }

  getChatPartnerId(chat: Chat, userId: string) {
    const chatPartnerId = chat.users.find(user => user !== userId);
    return chatPartnerId;
  }


  async loadUser(userId: string) {
      const docSnap = await this.firebaseService.getDocument('users', userId);
      const user = docSnap.data() as User;
      this.setActiveUser(user);
      this.firebaseService.getUserChannels(user)
  }

  async loadAvailableUsers() {
    await this.firebaseService.getCollection('users').then((user) => {
      user.forEach((userdata) => {
        this.availableUsers.push(userdata.data() as User)
      })
    })
    this.setUsers();
  }

  setActiveUser(user: User): void {
    this.activeUser.next([user]);
  }

  async editUserName(newName: string) {
    const user = this.activeUser.value[0];
    const newUser = new User({
      name: newName,
      email: user.email,
      profilepicture: user.profilepicture,
      channels: user.channels,
      chats: user.chats,
      id: user.id,
    });
    await this.firebaseService.updateDocument('users', user.id, newUser.toJSON());
  } 

  async editUserMail(newMail: string) {
    const user = this.activeUser.value[0];
    const newUser = new User({
      name: user.name,
      email: newMail,
      profilepicture: user.profilepicture,
      channels: user.channels,
      chats: user.chats,
      id: user.id,
    });
    await this.firebaseService.updateDocument('users', user.id, newUser.toJSON());
  }
}
