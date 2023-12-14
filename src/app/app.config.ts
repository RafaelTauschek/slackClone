import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"slack-clone-19a0c","appId":"1:139231253159:web:9109466346394168770182","storageBucket":"slack-clone-19a0c.appspot.com","apiKey":"AIzaSyAZ4eMpwxl5WTIFD-Y9OdHEDRcv9-gAnPM","authDomain":"slack-clone-19a0c.firebaseapp.com","messagingSenderId":"139231253159"}))), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideDatabase(() => getDatabase()))]
};
