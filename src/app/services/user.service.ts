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


  constructor(private firebaseService: FirebaseService) {

  }



  setActiveUser(user: User): void {
    console.log('User to set', user);
    this.activeUser.next([user]);
    console.log('Updated user:', this.activeUser);
  }

}
