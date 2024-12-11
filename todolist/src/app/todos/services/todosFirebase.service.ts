import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  setDoc,
  getDocs
} from '@angular/fire/firestore';
import { Observable, from, Subject, switchMap } from 'rxjs';
import { TodoInterface } from '../types/todo.interface';
import { AuthService } from '../../services/auth.service';
import { DbService } from '../../services/indexeddb.service';  // Import the IndexedDB service

@Injectable({ providedIn: 'root' })
export class TodosFirebaseService {
  firestore = inject(Firestore);
  authService = inject(AuthService);
  dbService = inject(DbService);  // Inject the IndexedDB service
  todosCollection = collection(this.firestore, 'todos');
  private firestoreAvailable = true; // Flag to check Firestore availability

  private todosSubject = new Subject<TodoInterface[]>(); // Create a Subject for todos
  todos$ = this.todosSubject.asObservable(); // Expose it as an Observable

  constructor() {
    this.checkFirestoreAvailability();
    this.syncTodosToIndexedDB();
  }

  private async checkFirestoreAvailability() {
    try {
      await getDocs(this.todosCollection);
      this.firestoreAvailable = true;
    } catch (error) {
      console.error('Firestore is not available:', error);
      this.firestoreAvailable = false;
    }
  }

  getTodos(): Observable<TodoInterface[]> {
    if (this.firestoreAvailable) {
      return collectionData(this.todosCollection, {
        idField: 'id',
      }) as Observable<TodoInterface[]>;
    } else {
      return from(this.dbService.getSortedTodos());
    }
  }

  addTodo(text: string): Observable<string> {
    const currentUser = this.authService.currentUserSig();
    const email = currentUser ? currentUser.email : 'Anonymous';

    const todoToCreate = { id: Date.now().toString(), text, isCompleted: false, email };
    const addToIndexedDB$ = from(this.dbService.addTodo(todoToCreate));  // Add to IndexedDB

    return addToIndexedDB$.pipe(
      switchMap(() => {
        if (this.firestoreAvailable) {
          const promise = addDoc(this.todosCollection, todoToCreate).then(
            (response) => {
              this.emitTodos(); // Emit updated todos
              return response.id;
            }
          );
          return from(promise);
        } else {
          return from(Promise.resolve(todoToCreate.id));
        }
      })
    );
  }

  updateTodo(
    todoId: string,
    dataToUpdate: { text: string; isCompleted: boolean }
  ): Observable<void> {
    const currentUser = this.authService.currentUserSig();
    const email = currentUser ? currentUser.email : 'Anonymous';

    const updatedData = {
      ...dataToUpdate,
      id: todoId, // Ensure id is included here
      email // Include email in the update
    };
    const updateInIndexedDB$ = from(this.dbService.updateTodo(updatedData));  // Update in IndexedDB

    return updateInIndexedDB$.pipe(
      switchMap(() => {
        if (this.firestoreAvailable) {
          const docRef = doc(this.firestore, 'todos/' + todoId);
          const promise = setDoc(docRef, updatedData).then(() => {
            this.emitTodos(); // Emit updated todos
          });
          return from(promise);
        } else {
          return from(Promise.resolve());
        }
      })
    );
  }

  removeTodo(todoId: string): Observable<void> {
    const deleteFromIndexedDB$ = from(this.dbService.deleteTodo(todoId));  // Delete from IndexedDB

    return deleteFromIndexedDB$.pipe(
      switchMap(() => {
        if (this.firestoreAvailable) {
          const docRef = doc(this.firestore, 'todos/' + todoId);
          const promise = deleteDoc(docRef).then(() => {
            this.emitTodos(); // Emit updated todos
          });
          return from(promise);
        } else {
          return from(Promise.resolve());
        }
      })
    );
  }

  private async emitTodos(): Promise<void> {
    if (this.firestoreAvailable) {
      const todos = await this.getTodos().toPromise();
      this.todosSubject.next(todos ?? []); // Emit todos or empty array if undefined
    } else {
      const todos = await this.dbService.getSortedTodos();
      this.todosSubject.next(todos ?? []); // Emit todos or empty array if undefined
    }
  }

  async syncTodosToIndexedDB(): Promise<void> {
    if (this.firestoreAvailable) {
      const querySnapshot = await getDocs(this.todosCollection);
      const todos: TodoInterface[] = [];
      querySnapshot.forEach((doc) => {
        todos.push(doc.data() as TodoInterface);
      });
      for (const todo of todos) {
        await this.dbService.addTodo(todo);
      }
    }
  }
}
