import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { environment } from '../../environments/environment';

interface MyDB extends DBSchema {
  todos: {
    key: string;
    value: {
      id: string;
      text: string;
      isCompleted: boolean;
      username: string;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private dbPromise: Promise<IDBPDatabase<MyDB>>;
  private firestore;
  private todosCollection;
  public firestoreAvailable = true; // Flag to check Firestore availability

  constructor() {
    this.dbPromise = this.initDB();
    const app = initializeApp(environment.firebaseConfig);
    this.firestore = getFirestore(app);
    this.todosCollection = collection(this.firestore, 'todos');
    this.checkFirestoreAvailability();
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

  public isFirestoreAvailable(): boolean {
    return this.firestoreAvailable;
  }

  private async initDB(): Promise<IDBPDatabase<MyDB>> {
    return openDB<MyDB>('my-database', 1, {
      upgrade(db) {
        db.createObjectStore('todos', { keyPath: 'id' });
      },
    });
  }

  async addTodo(todo: { id: string; text: string; isCompleted: boolean; username: string }): Promise<void> {
    if (!this.firestoreAvailable) {
      const db = await this.dbPromise;
      const existingTodo = await db.get('todos', todo.id);
      if (!existingTodo) {
        await db.add('todos', todo);
      }
    }
  }

  async getTodos(): Promise<{ id: string; text: string; isCompleted: boolean; username: string }[]> {
    if (!this.firestoreAvailable) {
      const db = await this.dbPromise;
      const todos = await db.getAll('todos');
      const uniqueTodos = Array.from(new Map(todos.map(todo => [todo.id, todo])).values());
      return uniqueTodos;
    }
    return [];
  }

  async getSortedTodos(): Promise<{ id: string; text: string; isCompleted: boolean; username: string }[]> {
    if (!this.firestoreAvailable) {
      const db = await this.dbPromise;
      const todos = await db.getAll('todos');
      const uniqueTodos = Array.from(new Map(todos.map(todo => [todo.id, todo])).values());
      return uniqueTodos.sort((a, b) => {
        const textComparison = a.text.localeCompare(b.text);
        if (textComparison !== 0) {
          return textComparison;
        }
        return a.username.localeCompare(b.username);
      });
    }
    return [];
  }

  async updateTodo(todo: { id: string; text: string; isCompleted: boolean; username: string }): Promise<void> {
    if (!this.firestoreAvailable) {
      const db = await this.dbPromise;
      await db.put('todos', todo);
    }
  }

  async deleteTodo(id: string): Promise<void> {
    if (!this.firestoreAvailable) {
      const db = await this.dbPromise;
      await db.delete('todos', id);
    }
  }
}
