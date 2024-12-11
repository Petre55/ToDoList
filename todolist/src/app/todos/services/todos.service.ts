import { Injectable, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { TodoInterface } from '../types/todo.interface';
import { FilterEnum } from '../types/filter.enum';
import { AuthService } from '../../auth.service';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  todosSig = signal<TodoInterface[]>([]);
  filterSig = signal<FilterEnum>(FilterEnum.all);
  authService = inject(AuthService);

  private todosSubject = new Subject<TodoInterface[]>(); // Create a Subject for todos
  todos$ = this.todosSubject.asObservable(); // Expose it as an Observable

  changeFilter(filterName: FilterEnum): void {
    this.filterSig.set(filterName);
  }

  addTodo(text: string, id: string): void {
    const currentUser = this.authService.currentUserSig();
    const newTodo: TodoInterface = {
      text,
      isCompleted: false,
      id, // Ensure the id is passed here correctly
      username: currentUser ? currentUser.displayName : 'Anonymous'
    };
    this.todosSig.update((todos) => [...todos, newTodo]);
    this.todosSubject.next(this.todosSig()); // Emit updated todos
  }

  changeTodo(id: string, text: string): void {
    this.todosSig.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
    this.todosSubject.next(this.todosSig()); // Emit updated todos
  }

  removeTodo(id: string): void {
    this.todosSig.update((todos) => todos.filter((todo) => todo.id !== id));
    this.todosSubject.next(this.todosSig()); // Emit updated todos
  }

  toggleTodo(id: string): void {
    this.todosSig.update((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
    this.todosSubject.next(this.todosSig()); // Emit updated todos
  }

  toggleAll(isCompleted: boolean): void {
    this.todosSig.update((todos) =>
      todos.map((todo) => ({ ...todo, isCompleted }))
    );
    this.todosSubject.next(this.todosSig()); // Emit updated todos
  }
}
