import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }), provideFirebaseApp(() => initializeApp({"projectId":"keller05","appId":"1:452921123770:web:8cd653619e0ecc3482b383","storageBucket":"keller05.firebasestorage.app","apiKey":"AIzaSyBSGNw-EYBW2M5UjkKDd5AHpfQ2oWvlIlg","authDomain":"keller05.firebaseapp.com","messagingSenderId":"452921123770"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())
  ]
};
