import { inject, Injectable, signal } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, user as firebaseUser } from "@angular/fire/auth";
import { from, Observable } from "rxjs";
import { UserInterface } from "../use.interface";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    firebaseAuth = inject(Auth);
    user$ = firebaseUser(this.firebaseAuth);
    currentUserSig = signal<UserInterface | null>(null);

    register(email: string, username: string, password: string): Observable<void> {
        const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
            .then(response => updateProfile(response.user, { displayName: username }));
        return from(promise);
    }

    login(email: string, password: string): Observable<void> {
        const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(() => { });
        return from(promise);
    }

    logout(): void {
        this.firebaseAuth.signOut();
        this.currentUserSig.set(null);
    }
}
