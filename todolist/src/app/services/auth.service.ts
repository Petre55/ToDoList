import { inject, Injectable, signal } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, user as firebaseUser } from "@angular/fire/auth";
import { from, Observable } from "rxjs";
import { UserInterface } from "../use.interface";
import { DbService } from "./indexeddb.service";
import * as bcrypt from 'bcryptjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    firebaseAuth = inject(Auth);
    dbService = inject(DbService);
    user$ = firebaseUser(this.firebaseAuth);
    currentUserSig = signal<UserInterface | null>(null);

    register(email: string, username: string, password: string): Observable<void> {
        const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
            .then(async response => {
                await updateProfile(response.user, { displayName: username });
                const hashedPassword = await bcrypt.hash(password, 10);
                await this.dbService.addUser(email, hashedPassword);
            });
        return from(promise);
    }

    async registerOffline(email: string, username: string, password: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.dbService.addUser(email, hashedPassword);
    }

    login(email: string, password: string): Observable<void> {
        const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
            .then(async () => {
                const user = await this.dbService.getUser(email);
                if (user && await bcrypt.compare(password, user.password)) {
                    this.currentUserSig.set({ email, displayName: user.email });
                }
            });
        return from(promise);
    }

    async loginOffline(email: string): Promise<void> {
            this.currentUserSig.set({ email, displayName: "Anonymous" });
            return Promise.resolve();
    }

    async logout(): Promise<void> {
        await this.firebaseAuth.signOut();
        this.currentUserSig.set(null);
    }
}
