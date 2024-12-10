import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { TodoItem } from '../todo-item';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService extends Dexie {
  todos: Dexie.Table<TodoItem, number>;

  constructor() {
    super('TodoDatabase');
    this.version(1).stores({
      todos: '++id, description, done'
    });
    this.todos = this.table('todos');
  }

  // Add a new Todo item
  async addTodoItem(item: TodoItem): Promise<number> {
    return this.todos.add(item);
  }

  // Get all Todo items
  async getTodoItems(): Promise<TodoItem[]> {
    return this.todos.toArray();
  }

  // Update a Todo item
  async updateTodoItem(item: TodoItem): Promise<number | undefined> {
    if (item.id !== undefined) {
      return this.todos.update(item.id, item);
    } else {
      console.error('Todo item ID is undefined');
      return undefined;
    }
  }

  // Delete a Todo item
  async deleteTodoItem(id: number): Promise<void> {
    await this.todos.delete(id);
  }
}
