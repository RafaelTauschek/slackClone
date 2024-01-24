
import { ApplicationConfig, ChangeDetectorRef, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { MatDialogModule } from '@angular/material/dialog';
import { firebaseProviders } from './firebase.config';




export const appConfig: ApplicationConfig = {
  providers: [
    firebaseProviders,
    provideRouter(routes),
    importProvidersFrom(MatDialogModule),
  ],
};


