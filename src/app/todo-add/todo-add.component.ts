import { Component, OnInit } from '@angular/core';
import { TodosService } from '../service/todos.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-add',
  templateUrl: './todo-add.component.html',
  styleUrls: ['./todo-add.component.css']
})
export class TodoAddComponent implements OnInit {

  todoForm: FormGroup;
  constructor(private todosService: TodosService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.todoForm = this.formBuilder.group({
      title: [],
      date: []
    });
  }

  onSubmit() {
    if (!this.todoForm.valid) {
      return;
    }

    const todo = {
      title: this.todoForm.value.title,
      date: new Date(this.todoForm.value.date),
      created: new Date(),
      status: true
    };

    this.todosService.createTodo(todo);
    this.router.navigate(['/todoList']);
  }
}
