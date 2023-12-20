import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);


  getCollectionRef(colId: string) {
    return collection(this.firestore, colId);
  }

  getDocumentRef(colId: string, docId: string) {
    return (collection(this.firestore, colId), docId);
  }
}
