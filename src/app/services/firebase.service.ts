import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, addDoc, updateDoc, doc, setDoc, getDoc, query, getDocs, where, arrayUnion } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

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



}
