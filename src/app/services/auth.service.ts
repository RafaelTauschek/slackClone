import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged, getAuth, createUserWithEmailAndPassword, 
  signOut, signInWithRedirect, sendPasswordResetEmail, getRedirectResult } from "firebase/auth";
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
  user: User[] = [];
  userDocId: string = '';


  constructor(
    private userService: UserService, private router: Router, private firebaseService: FirebaseService, private channelService: ChannelService) {
      this.setupAuthStateListener();
  }



  setupAuthStateListener(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.handeUserLoggedIn(user);
      } else {
        this.handleUserLoggedOut();
      }
    });
  }

  handeUserLoggedIn(user: any): void {
    console.log('User is currently logged in with id: ', user.uid);
    this.userService.loadUser(user.uid);
    this.channelService.loadChannels(user.uid);
  }



  handleUserLoggedOut(): void {
    console.log('User is currently logged out');
  }

  async loginGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider).then(async (user) => {
      const userSnap = await this.firebaseService.getDocument('users', user.user.uid);
      if (userSnap.exists()) {
        setTimeout(() => {
          this.router.navigate(['/main'])
        }, 500);
      } else {
        const userData = {
          name: user.user.displayName,
          email: user.user.email,
          id: user.user.uid,
          profilepicture: '',
          chats: [],
          channels: [],
        };
        await this.firebaseService.setDocument(this.userDocId, 'users', userData);
        this.router.navigate(['/select-avatar', { docId: this.userDocId, name: userData.name, email: userData.email }]);
      }
    }, err => {
      console.log(err);
    })
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password).then(() => {
      setTimeout( () => {
        this.router.navigate(['/main'])
      }, 500);
    }, err => {
      console.log(err);
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

  // async loginWithRedirect() { 
  //   const provider = new GoogleAuthProvider();
  //   signInWithRedirect(this.auth, provider);
  //   await this.auth.getRedirectResult().then((result) => {
  //     const credential = GoogleAuthProvider.credentialFromResult(result);
  //     const token = credential?.accessToken;
  //     const user = result.user;
  //     console.log(user);
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // }


  logout() {
    signOut(this.auth);
    this.router.navigate(['/']);
  }


  resetPassword(email: string) {
    sendPasswordResetEmail(this.auth, email).then(() => {
      console.log('Email was send');
    }).catch((err) => {
      console.log(err);
    })
  }



}


