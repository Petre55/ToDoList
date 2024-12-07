import { Component, OnInit } from '@angular/core';
import { TodosService } from '../service/todos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private todosService: TodosService) { }

  private todoLimit = 5;
  public lastCreatedFiveTodos = [];

  ngOnInit() {
    this.findLastCreatedTodos();
  }

  findLastCreatedTodos() {
    this.todosService.findLastCreatedTodos(this.todoLimit).subscribe( res => {
      this.lastCreatedFiveTodos = res;
    });
  }

}
