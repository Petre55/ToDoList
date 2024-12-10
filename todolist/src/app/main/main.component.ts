import { Component, OnInit } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Observable } from 'rxjs';
import { TodoItem } from '../todo-item';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ItemComponent} from '../item/item.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    ItemComponent,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  componentTitle = "My To-Do List";
  items$: Observable<TodoItem[]>;
  filter$: Observable<string>;
  message$: Observable<string>;

  constructor(private todoService: TodoService) {
    this.items$ = this.todoService.getTodos();
    this.filter$ = this.todoService.getFilter();
    this.message$ = this.todoService.getMessage();
  }

  ngOnInit(): void {
    // No need for additional initialization in this case
  }

  addItem(description: string) {
    this.todoService.addTodoItem(description);
  }

  remove(item: TodoItem) {
    if (item.id !== undefined) {
      this.todoService.deleteTodoItem(item.id);
    }
  }

  toggleDone(item: TodoItem) {
    if (item.id !== undefined) {
      const updatedItem = { ...item, done: !item.done };
      this.todoService.updateTodoItem(updatedItem);
    }
  }

  setFilter(filter: string) {
    this.todoService.setFilter(filter);
  }

  getFilteredItems(items: TodoItem[], filter: string): TodoItem[] {
    if (filter === "all") {
      return items;
    }
    return items.filter(item => filter === "done" ? item.done : !item.done);
  }
}
