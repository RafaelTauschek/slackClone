import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, addDoc, updateDoc, doc, setDoc, getDoc, query, getDocs, where, arrayUnion } from 'firebase/firestore';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';




@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);


  getCollectionRef(colId: string) {
    return collection(this.firestore, colId);
  }

  getDocumentRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  async addCollection(colId: string, item: {}) {
    const docRef = await addDoc(this.getCollectionRef(colId), item);
    return docRef.id;
  }

  async setDocument(docId: string, colId: string, item: {}) {
    await setDoc(doc(this.getCollectionRef(colId), docId), item);
  }

  async updateDocument(colId: string, docId: string, item: {}) {
    await updateDoc(this.getDocumentRef(colId, docId), item)
  }

  async getDocument(colId: string, docId: string) {
    const docRef = this.getDocumentRef(colId, docId);
    const docSnap = await getDoc(docRef);
    return docSnap;
  }

  async getCollection(colId: string) {
    const docRef = this.getCollectionRef(colId)
    return await getDocs(docRef);
  }


  async updateMessages(colId: string, docId: string, item: {}) {
    updateDoc(this.getDocumentRef(colId, docId), {
      messages: arrayUnion(item)
    });
  }

  async updateChats(colId: string, docId: string, item: {}) {
    updateDoc(this.getDocumentRef(colId, docId), {
      chats: arrayUnion(item)
    });
  }


  async getUserChannels(user: User) {
    if (user) {
      try {
        const channelsCollectionRef = collection(this.firestore, 'channels');
        const channelIds = user.channels;
        const q = query(channelsCollectionRef, where('id', 'in', channelIds));
        const querySnapshot = await getDocs(q);
        const channels: Channel[] = [];
        querySnapshot.forEach((doc) => {
          channels.push(doc.data() as Channel)
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
}
