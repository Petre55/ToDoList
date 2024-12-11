import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/main/main.component';
import { TodosService } from './services/todos.service';
import { TodosFirebaseService } from './services/todosFirebase.service';
import { DbService } from '../services/indexeddb.service';  // Import the IndexedDB service

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, MainComponent], // Include CommonModule
})
export class TodosComponent implements OnInit, OnDestroy {
  todosService = inject(TodosService);
  todosFirebaseService = inject(TodosFirebaseService);
  dbService = inject(DbService);  // Inject the IndexedDB service

  ngOnInit(): void {
    if (this.dbService.isFirestoreAvailable()) {
      this.todosFirebaseService.getTodos().subscribe((todos) => {
        this.todosService.todosSig.set(todos);
      });
    } else {
      this.dbService.getSortedTodos().then((todos) => {
        this.todosService.todosSig.set(todos);
      });
    }
  }

  get filteredTodos() {
    return this.todosService.filteredTodos();
  }

  ngOnDestroy(): void {
    if (this.dbService.isFirestoreAvailable()) {
      this.todosFirebaseService.syncTodosToIndexedDB();
    }
  }
}
