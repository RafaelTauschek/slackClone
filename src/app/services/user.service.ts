import { Injectable } from '@angular/core';
import { User } from '../models/user.class';
import { FirebaseService } from './firebase.service';
import { BehaviorSubject } from 'rxjs';
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

  getProfilePictureURL(userId: string): string {
    const userProfilePicture = this.getUserProfilePicture(userId);
    if (userProfilePicture && userProfilePicture.startsWith('http')) {
      return userProfilePicture;
    } else {
      return './assets/img/avatars/' + userProfilePicture + '.png';
    }
  }

  getInitials() {
    const user = this.activeUser.value[0];
    const name = user.name.split(' ');
    const initials = name[0].charAt(0).toUpperCase() + '.' + name[name.length - 1].charAt(0).toUpperCase() + '.';
    return initials;
  }

  getChatPartnerId(chat: Chat, userId: string) {
    const chatPartnerId = chat.users.find(user => user !== userId);
    return chatPartnerId;
  }

  testuser: User[] = [];

  async loadUser(userId: string) {
      const docSnap = await this.firebaseService.getDocument('users', userId);
      const user = docSnap.data() as User;
      this.testuser = [user];
      console.log('testuser: ', this.testuser);
      this.setActiveUser(user);
      if (user.channels.length > 0) {
        await this.firebaseService.getUserChannels(user);
      }
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
    const name = newName;
    const user = this.activeUser.value[0];
    const newUser = new User({
      name: name,
      email: user.email,
      profilepicture: user.profilepicture,
      channels: user.channels,
      chats: user.chats,
      id: user.id,
    });
    console.log('new User: ', newUser);
    await this.firebaseService.updateDocument('users', user.id, newUser.toJSON());
    await this.loadUser(user.id);
  } 

  async editUserMail(newMail: string) {
    console.log('new Mail: ', newMail);
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
    await this.loadUser(user.id);
  }


  async addChannelToUsers(users: string[], channelId: string) {
    users.forEach(async (user) => {
      const docSnap = await this.firebaseService.getDocument('users', user);
      const userData = docSnap.data() as User;
      const newUser = new User({
        name: userData.name,
        email: userData.email,
        profilepicture: userData.profilepicture,
        channels: [...userData.channels, channelId],
        chats: userData.chats,
        id: userData.id,
      });
      await this.firebaseService.updateDocument('users', userData.id, newUser.toJSON());
    })
  }
}
