import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { environment } from '../../environments/environment';
import * as bcrypt from 'bcryptjs';

interface MyDB extends DBSchema {
  todos: {
    key: string;
    value: {
      id: string;
      text: string;
      isCompleted: boolean;
      email: string;
    };
  };
  users: {
    key: string;
    value: {
      email: string;
      password: string;
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
    return openDB<MyDB>('my-database', 2, { // Increment the version number if schema changes
      upgrade(db) {
        if (!db.objectStoreNames.contains('todos')) {
          db.createObjectStore('todos', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'email' });
        }
      },
    });
  }
  

  async addUser(email: string, password: string): Promise<void> {
    const db = await this.dbPromise;
    const existingUser = await db.get('users', email);
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.add('users', { email, password: hashedPassword });
    }
  }

  async getUser(email: string): Promise<{ email: string; password: string } | undefined> {
    const db = await this.dbPromise;
    return db.get('users', email);
  }

  async addTodo(todo: { id: string; text: string; isCompleted: boolean; email: string }): Promise<void> {
    if (!this.firestoreAvailable) {
      const db = await this.dbPromise;
      const existingTodo = await db.get('todos', todo.id);
      if (!existingTodo) {
        await db.add('todos', todo);
      }
    }
  }

  async getTodos(): Promise<{ id: string; text: string; isCompleted: boolean; email: string }[]> {
    if (!this.firestoreAvailable) {
      const db = await this.dbPromise;
      const todos = await db.getAll('todos');
      const uniqueTodos = Array.from(new Map(todos.map(todo => [todo.id, todo])).values());
      return uniqueTodos;
    }
    return [];
  }

  async getSortedTodos(): Promise<{ id: string; text: string; isCompleted: boolean; email: string }[]> {
    if (!this.firestoreAvailable) {
      const db = await this.dbPromise;
      const todos = await db.getAll('todos');
      const uniqueTodos = Array.from(new Map(todos.map(todo => [todo.id, todo])).values());
      return uniqueTodos.sort((a, b) => {
        const textComparison = a.text.localeCompare(b.text);
        if (textComparison !== 0) {
          return textComparison;
        }
        return a.email.localeCompare(b.email);
      });
    }
    return [];
  }

  async updateTodo(todo: { id: string; text: string; isCompleted: boolean; email: string }): Promise<void> {
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
