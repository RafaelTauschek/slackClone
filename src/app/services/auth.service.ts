import {Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged, getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { UserService } from './user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private userService: UserService, private router: Router) {}


  async loginGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    await signInWithPopup(auth, provider).then((userCredential) => {
      const user = userCredential;
      console.log('User logged in: ', user);
      this.router.navigate(['/landingPage']);
    }).catch((e) => {
      console.log(e);
    });
  }


  async login(email: string, password: string) {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential;
      console.log('User logged in: ', user);
      this.router.navigate(['/landingPage']);
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
