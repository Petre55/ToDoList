import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosService } from '../../services/todos.service';
import { FilterEnum } from '../../types/filter.enum';

@Component({
  selector: 'app-todos-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class FooterComponent {
  todosService = inject(TodosService);
  filterSig = this.todosService.filterSig;
  filterEnum = FilterEnum;

  activeCount = computed(() => {
    const currentUser = this.todosService.authService.currentUserSig();
    const username = currentUser ? currentUser.displayName : 'Anonymous';
    return this.todosService.todosSig().filter((todo) => !todo.isCompleted && todo.username === username).length;
  });

  noTodosClass = computed(() => {
    const currentUser = this.todosService.authService.currentUserSig();
    const username = currentUser ? currentUser.displayName : 'Anonymous';
    return this.todosService.todosSig().filter((todo) => todo.username === username).length === 0;
  });

  itemsLeftText = computed(
    () => `item${this.activeCount() !== 1 ? 's' : ''} left`
  );

  changeFilter(event: Event, filterName: FilterEnum): void {
    event.preventDefault();
    this.todosService.changeFilter(filterName);
    console.log('after changeFilter', this.todosService.filterSig());
  }
}
