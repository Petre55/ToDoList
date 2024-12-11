import { Component, inject, OnInit } from '@angular/core';
import { TodosService } from '../../services/todos.service';
import { TodosFirebaseService } from '../../services/todosFirebase.service';

@Component({
  selector: 'app-todos-header',
  templateUrl: './header.component.html',
  standalone: true,
})
export class HeaderComponent implements OnInit {
  todosService = inject(TodosService);
  todosFirebaseService = inject(TodosFirebaseService);
  text: string = '';

  ngOnInit() {
    // Subscribe to todos updates
    this.todosService.todos$.subscribe((todos) => {
      console.log('Todos updated:', todos);
    });
  }

  changeText(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.text = target.value;
  }

  addTodo(): void {
    this.todosFirebaseService.addTodo(this.text).subscribe((addedTodoId) => {
      this.todosService.addTodo(this.text, addedTodoId);
      this.text = '';
    });
  }
}
