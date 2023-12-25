import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged, getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment.development';
import { FirebaseService } from './firebase.service';
import { User } from '../models/user.class';
import { ChannelService } from './channel.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  app = initializeApp(environment.firebase);
  auth: Auth = getAuth(this.app);
  userDocId: string = '';

  
  constructor(private userService: UserService, private router: Router, private firebaseService: FirebaseService,
    private channelService: ChannelService) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('Current user logged in: ', user);
        console.log('Current userID is: ', user.uid);
        this.userDocId = user.uid;
        this.userService.loadUser(this.userDocId);
      } else {
        console.log('User was logged out');
      }
    })

  }



  async loginGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(this.auth, provider);
      const user = userCredential.user;
      this.userDocId = user.uid;
      const userSnap = await this.firebaseService.getDocument('users', this.userDocId);
      if (userSnap.exists()) {
        this.router.navigate(['landingPage/']);
        this.userService.loadUser(this.userDocId);
        this.channelService.loadChannels();
      } else {
        const userData = {
          name: user.displayName,
          email: user.email,
          id: this.userDocId,
          profilepicture: '',
          chats: [],
          channels: [],
        };
        await this.firebaseService.setDocument(this.userDocId, 'users', userData);
        this.router.navigate(['/select-avatar', { docId: this.userDocId, name: userData.name, email: userData.email }]);
      }
    } catch (err) {
      console.log(err);
    }
  }


  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
      const user = userCredential.user;
      this.userDocId = user.uid;
      console.log('User logged in: ', user);
      this.router.navigate(['/landingPage']);
      this.userService.loadUser(this.userDocId);
      this.channelService.loadChannels();
    }).catch((e) => {
      console.error(e);
    })
  }


  async registerUser(email: string, password: string, name: string) {
    await createUserWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
      const user = userCredential.user;
      this.userDocId = user.uid;
      const userData = {
        name: name,
        email: email,
        id: this.userDocId,
        profilepicture: '',
        chats: [],
        channels: [],
      };
      this.firebaseService.setDocument(this.userDocId, 'users', userData);
      this.router.navigate(['/select-avatar', { docId: this.userDocId, name: name, email: email }]);
    }).catch((err) => {
      console.log(err);
    })
  }


  logout() {
    signOut(this.auth);
    this.router.navigate(['/']);
  }

}
