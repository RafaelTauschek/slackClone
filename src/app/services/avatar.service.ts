import { Injectable } from '@angular/core';
import { getStorage, ref } from "firebase/storage";
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  app = initializeApp(environment.firebase);
  storage = getStorage(this.app)

  constructor() {}

  uploadAvatar(file: File, userId: string) {
    
  } 
}
