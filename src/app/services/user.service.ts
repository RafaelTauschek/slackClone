import { Injectable } from '@angular/core';
import { User } from '../models/user.class';
import { FirebaseService } from './firebase.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  activeUser = new BehaviorSubject<User[]>([]);
  activeUserObservable$ = this.activeUser.asObservable();
  availableUsers: User[] = []


  constructor(private firebaseService: FirebaseService) {
    this.loadAvailableUsers();
    console.log(this.availableUsers);
    
  }

  async loadUser(userId: string) {
      const docSnap = await this.firebaseService.getDocument('users', userId);
      const user = docSnap.data() as User;
      this.setActiveUser(user);
  }

  async loadAvailableUsers() {
    await this.firebaseService.getCollection('users').then((user) => {
      user.forEach((userdata) => {
        this.availableUsers.push(userdata.data() as User)
      })
    })

    console.log('Available users: ', this.availableUsers);
    
  }

  setActiveUser(user: User): void {
    console.log('User to set', user);
    this.activeUser.next([user]);
    console.log('Updated user:', this.activeUser);
  }

}
