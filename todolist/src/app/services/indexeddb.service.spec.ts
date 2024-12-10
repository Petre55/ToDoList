import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TodoItem } from '../todo-item';
import { IndexedDBService } from './indexeddb.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosSubject: BehaviorSubject<TodoItem[]> = new BehaviorSubject<TodoItem[]>([]);
  private filterSubject: BehaviorSubject<string> = new BehaviorSubject<string>('all');
  private messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private dbService: IndexedDBService) {
    this.loadTodos();
  }

  getTodos(): Observable<TodoItem[]> {
    return this.todosSubject.asObservable();
  }

  getFilter(): Observable<string> {
    return this.filterSubject.asObservable();
  }

  getMessage(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  async loadTodos() {
    const todos = await this.dbService.getTodoItems();
    this.todosSubject.next(todos);
  }

  async addTodoItem(description: string) {
    if (!description) {
      this.messageSubject.next('Description cannot be empty');
      return;
    }
    const newItem: TodoItem = { id: Date.now(), description, done: false };
    await this.dbService.addTodoItem(newItem);
    this.loadTodos();
    this.messageSubject.next('Item added successfully');
  }

  async updateTodoItem(item: TodoItem) {
    await this.dbService.updateTodoItem(item);
    this.loadTodos();
  }

  async deleteTodoItem(id: number) {
    await this.dbService.deleteTodoItem(id);
    this.loadTodos();
    this.messageSubject.next('Item removed successfully');
  }

  setFilter(filter: string) {
    this.filterSubject.next(filter);
  }
}
