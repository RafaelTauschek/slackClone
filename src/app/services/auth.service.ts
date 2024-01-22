import { Injectable } from '@angular/core';
import {
  Auth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged, getAuth, createUserWithEmailAndPassword,
  signOut, sendPasswordResetEmail, signInWithRedirect, getRedirectResult, updatePassword, updateEmail, confirmPasswordReset
} from "firebase/auth";
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment.development';
import { FirebaseService } from './firebase.service';
import { User } from '../models/user.class';
import { UserDataService } from './data.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  app = initializeApp(environment.firebase);
  auth: Auth = getAuth(this.app);
  user: User[] = [];
  userDocId: string = '';


  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private data: UserDataService) {
    this.setupAuthStateListener();
  }


  setupAuthStateListener(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.handeUserLoggedIn(user);
      } else {
        this.handleUserLoggedOut(user);
      }
    });
  }


  async handeUserLoggedIn(user: any) {
    this.data.fetchUserData(user.uid);
  }


  async handleUserLoggedOut(user: any) {
  }


  async loginGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider).then(async (user) => {
      const userSnap = await this.firebaseService.getDocument('users', user.user.uid);
      this.userDocId = user.user.uid;
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
      setTimeout(() => {
        this.router.navigate(['/main'])
      }, 500);
    }, err => {
      console.log(err);
    })
  }
  async changeUserMail() {
  }


  async registerUser(email: string, password: string, name: string) {
    await createUserWithEmailAndPassword(this.auth, email, password).then(async (userCredential) => {
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
      await this.firebaseService.setDocument(this.userDocId, 'users', userData);
      this.router.navigate(['/select-avatar', { docId: this.userDocId, name: name, email: email }]);
    }).catch((err) => {
      console.log(err);
    })
  }


  logout() {
    signOut(this.auth);
    this.router.navigate(['/']);
  }


  updatePassword(password: string) {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      updatePassword(currentUser, password).then(() => {
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  updateEmail(email: string) {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      updateEmail(currentUser, email).then(() => {
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  resetPassword(email: string) {
    sendPasswordResetEmail(this.auth, email).then(() => {
      console.log('reset mail was sent');
    }).catch((err) => {
      console.log(err);
    });
  }

  changePassword(password: string, oobCode: string|null) {
    const auth = getAuth();
    if (oobCode) {
      confirmPasswordReset(auth, oobCode, password).then(() => {
        console.log('password was changed');
        this.router.navigate(['/']);
      }).catch((err) => {
        console.log(err);
      });
    } else {
      console.log('no oobCode was provided');
    }
  }


}


