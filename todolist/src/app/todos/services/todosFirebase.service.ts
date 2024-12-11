import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, from, Subject, switchMap } from 'rxjs';
import { TodoInterface } from '../types/todo.interface';
import { AuthService } from '../../auth.service';
import { DbService } from '../../services/indexeddb.service';  // Import the IndexedDB service

@Injectable({ providedIn: 'root' })
export class TodosFirebaseService {
  firestore = inject(Firestore);
  authService = inject(AuthService);
  dbService = inject(DbService);  // Inject the IndexedDB service
  todosCollection = collection(this.firestore, 'todos');

  private todosSubject = new Subject<TodoInterface[]>(); // Create a Subject for todos
  todos$ = this.todosSubject.asObservable(); // Expose it as an Observable

  getTodos(): Observable<TodoInterface[]> {
    return collectionData(this.todosCollection, {
      idField: 'id',
    }) as Observable<TodoInterface[]>;
  }

  addTodo(text: string): Observable<string> {
    const currentUser = this.authService.currentUserSig();
    const username = currentUser ? currentUser.displayName : 'Anonymous';

    const todoToCreate = { id: Date.now().toString(), text, isCompleted: false, username };
    const addToIndexedDB$ = from(this.dbService.addTodo(todoToCreate));  // Add to IndexedDB

    return addToIndexedDB$.pipe(
      switchMap(() => {
        const promise = addDoc(this.todosCollection, todoToCreate).then(
          (response) => {
            this.emitTodos(); // Emit updated todos
            return response.id;
          }
        );
        return from(promise);
      })
    );
  }

  updateTodo(
    todoId: string,
    dataToUpdate: { text: string; isCompleted: boolean }
  ): Observable<void> {
    const currentUser = this.authService.currentUserSig();
    const username = currentUser ? currentUser.displayName : 'Anonymous';
  
    const updatedData = {
      ...dataToUpdate,
      id: todoId, // Ensure id is included here
      username // Include username in the update
    };
    const updateInIndexedDB$ = from(this.dbService.updateTodo(updatedData));  // Update in IndexedDB
  
    return updateInIndexedDB$.pipe(
      switchMap(() => {
        const docRef = doc(this.firestore, 'todos/' + todoId);
        const promise = setDoc(docRef, updatedData).then(() => {
          this.emitTodos(); // Emit updated todos
        });
        return from(promise);
      })
    );
  }
  

  removeTodo(todoId: string): Observable<void> {
    const deleteFromIndexedDB$ = from(this.dbService.deleteTodo(todoId));  // Delete from IndexedDB

    return deleteFromIndexedDB$.pipe(
      switchMap(() => {
        const docRef = doc(this.firestore, 'todos/' + todoId);
        const promise = deleteDoc(docRef).then(() => {
          this.emitTodos(); // Emit updated todos
        });
        return from(promise);
      })
    );
  }

  private async emitTodos(): Promise<void> {
    const todos = await this.getTodos().toPromise();
    this.todosSubject.next(todos ?? []); // Emit todos or empty array if undefined
  }
}
