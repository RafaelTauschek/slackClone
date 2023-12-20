import {Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged, getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { UserService } from './user.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private userService: UserService) {}


  loginGoogle() {
    const provider = new GoogleAuthProvider();
  }


  async login(email: string, password: string) {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential;
      console.log('User logged in: ', user);
    }).catch((e) => {
      console.error(e);
    })
  }

  async registerUser(email: string, password: string) {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user;
      console.log('User registered: ', user);
    }).catch((e) => {
      console.error(e);
    });
  }

}
