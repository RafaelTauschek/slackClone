import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storage = getStorage();


  async uploadFile(file: File): Promise<string> {
    const uniqueFileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(this.storage, uniqueFileName);
    const result = await uploadBytes(storageRef, file);
    return await getDownloadURL(result.ref);
  }
}
