import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storage = getStorage();


  async uploadFile(file: File): Promise<string> {
    const storageRef = ref(this.storage, file.name);
    const result = await uploadBytes(storageRef, file);
    return getDownloadURL(result.ref);
  }
}
