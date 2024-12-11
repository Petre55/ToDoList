import { Component, computed, inject, Input } from '@angular/core';
import { TodosService } from '../../services/todos.service';
import { CommonModule } from '@angular/common';
import { FilterEnum } from '../../types/filter.enum';
import { TodoComponent } from '../todo/todo.component';
import { forkJoin } from 'rxjs';
import { TodosFirebaseService } from '../../services/todosFirebase.service';
import { TodoInterface } from '../../types/todo.interface';

@Component({
  selector: 'app-todos-main',
  templateUrl: './main.component.html',
  standalone: true,
  imports: [CommonModule, TodoComponent], // Include TodoComponent
})
export class MainComponent {
  @Input() todo!: TodoInterface;
  todosService = inject(TodosService);
  todosFirebaseService = inject(TodosFirebaseService);
  editingId: string | null = null;

  visibleTodos = computed(() => {
    const todos = this.todosService.todosSig();
    const filter = this.todosService.filterSig();
    const currentUser = this.todosService.authService.currentUserSig();
    const username = currentUser ? currentUser.displayName : 'Anonymous';

    let filteredTodos = todos.filter(todo => todo.username === username);
    if (filter === FilterEnum.active) {
      filteredTodos = filteredTodos.filter((todo) => !todo.isCompleted);
    } else if (filter === FilterEnum.completed) {
      filteredTodos = filteredTodos.filter((todo) => todo.isCompleted);
    }

    // Sort by text
    return filteredTodos.sort((a, b) => a.text.localeCompare(b.text));
  });

  isAllTodosSelected = computed(() =>
    this.todosService.todosSig().every((todo) => todo.isCompleted)
  );

  noTodosClass = computed(() => this.todosService.todosSig().length === 0);

  setEditingId(editingId: string | null): void {
    this.editingId = editingId;
  }

  toggleAllTodos(event: Event): void {
    const target = event.target as HTMLInputElement;
    const requests$ = this.todosService.todosSig().map((todo) => {
      return this.todosFirebaseService.updateTodo(todo.id, {
        text: todo.text,
        isCompleted: target.checked,
      });
    });
    forkJoin(requests$).subscribe(() => {
      this.todosService.toggleAll(target.checked);
    });
  }
}
