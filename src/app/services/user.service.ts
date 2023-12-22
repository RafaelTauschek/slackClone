import { Injectable } from '@angular/core';
import { User } from '../models/user.class';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firebaseService: FirebaseService) { }

  
}
