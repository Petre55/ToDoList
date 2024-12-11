import { Injectable, inject, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';
import { TodoInterface } from '../types/todo.interface';
import { FilterEnum } from '../types/filter.enum';
import { AuthService } from '../../services/auth.service';
import { DbService } from '../../services/indexeddb.service';  // Import the IndexedDB service

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  todosSig = signal<TodoInterface[]>([]);
  filterSig = signal<FilterEnum>(FilterEnum.all);
  authService = inject(AuthService);
  dbService = inject(DbService);  // Inject the IndexedDB service

  private todosSubject = new Subject<TodoInterface[]>(); // Create a Subject for todos
  todos$ = this.todosSubject.asObservable(); // Expose it as an Observable

  filteredTodos = computed(() => {
    const currentUser = this.authService.currentUserSig();
    const email = currentUser ? currentUser.email : 'Anonymous';
    return this.todosSig().filter(todo => todo.email === email);
  });

  changeFilter(filterName: FilterEnum): void {
    this.filterSig.set(filterName);
  }

  async addTodo(text: string, id: string): Promise<void> {
    const currentUser = this.authService.currentUserSig();
    const newTodo: TodoInterface = {
      text,
      isCompleted: false,
      id,
      email: currentUser ? currentUser.email : 'Anonymous'
    };
    this.todosSig.update((todos) => [...todos, newTodo]);
    this.todosSubject.next(this.todosSig()); // Emit updated todos

    if (!this.dbService.firestoreAvailable) {
      await this.dbService.addTodo(newTodo);  // Add to IndexedDB if Firestore is not available
    }
  }

  async changeTodo(id: string, text: string): Promise<void> {
    this.todosSig.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
    this.todosSubject.next(this.todosSig()); // Emit updated todos

    if (!this.dbService.firestoreAvailable) {
      const updatedTodo = this.todosSig().find(todo => todo.id === id);
      if (updatedTodo) {
        await this.dbService.updateTodo(updatedTodo);  // Update in IndexedDB if Firestore is not available
      }
    }
  }

  async removeTodo(id: string): Promise<void> {
    this.todosSig.update((todos) => todos.filter((todo) => todo.id !== id));
    this.todosSubject.next(this.todosSig()); // Emit updated todos

    if (!this.dbService.firestoreAvailable) {
      await this.dbService.deleteTodo(id);  // Delete from IndexedDB if Firestore is not available
    }
  }

  async toggleTodo(id: string): Promise<void> {
    this.todosSig.update((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
    this.todosSubject.next(this.todosSig()); // Emit updated todos

    if (!this.dbService.firestoreAvailable) {
      const updatedTodo = this.todosSig().find(todo => todo.id === id);
      if (updatedTodo) {
        await this.dbService.updateTodo(updatedTodo);  // Update in IndexedDB if Firestore is not available
      }
    }
  }

  async toggleAll(isCompleted: boolean): Promise<void> {
    this.todosSig.update((todos) =>
      todos.map((todo) => ({ ...todo, isCompleted }))
    );
    this.todosSubject.next(this.todosSig()); // Emit updated todos

    if (!this.dbService.firestoreAvailable) {
      const updatedTodos = this.todosSig();
      for (const todo of updatedTodos) {
        await this.dbService.updateTodo(todo);  // Update in IndexedDB if Firestore is not available
      }
    }
  }
}
