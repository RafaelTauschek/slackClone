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

  // uploadAvatar(file: File, userId: string): Observable<number> { 
  //   const storageRef = ref(this.storage, `avatars/${userId}`);
  //   return new Observable((subscriber) => {
  //     const uploadTask = storageRef.put(file);
  //     uploadTask.on('state_changed', (snapshot) => {
  //       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       subscriber.next(progress);
  //     }, error => {
  //       subscriber.error(error);
  //     }, () => {
  //       uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
  //         subscriber.next(downloadURL);
  //       });
  //     });
  //   });
  // }
}
