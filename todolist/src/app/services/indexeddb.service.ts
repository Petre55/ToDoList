import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

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

  constructor() {
    this.dbPromise = this.initDB();
  }

  private async initDB(): Promise<IDBPDatabase<MyDB>> {
    return openDB<MyDB>('my-database', 1, {
      upgrade(db) {
        db.createObjectStore('todos', { keyPath: 'id' });
      },
    });
  }

  async addTodo(todo: { id: string; text: string; isCompleted: boolean; username: string }): Promise<void> {
    const db = await this.dbPromise;
    await db.add('todos', todo);
  }

  async getTodos(): Promise<{ id: string; text: string; isCompleted: boolean; username: string }[]> {
    const db = await this.dbPromise;
    return db.getAll('todos');
  }

  async updateTodo(todo: { id: string; text: string; isCompleted: boolean; username: string }): Promise<void> {
    const db = await this.dbPromise;
    await db.put('todos', todo);
  }

  async deleteTodo(id: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('todos', id);
  }
}
