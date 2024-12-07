# Firebase Firestore and Angular ToDo List App

This project was generated with Angular CLI version 6.2.9

## Development server
Run ```ng serve``` for a dev server. Navigate to ```http://localhost:4200/```. The app will automatically reload if you change any of the source files.

## Build
Run ```ng build``` to build the project. The build artifacts will be stored in the ```dist/``` directory. Use the ```-prod``` flag for a production build.

## Firebase config
Navigate to your environment.ts file and update your firebaseConfig. It is now necessary to have a projectId when initializing firebase, so make sure it’s included in the config object.

```Javascript
export const environment = {
    production: true,
    firebaseConfig: {
       apiKey: "",
       authDomain: "",
       databaseURL: "",
       projectId: "",
       storageBucket: "",
       messagingSenderId: ""
     }
};
```
