import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoItem } from '../todo-item';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  standalone: true,
  imports: [
    NgIf
  ],
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  @Input() item!: TodoItem;
  @Output() remove = new EventEmitter<void>();
  @Output() toggleDone = new EventEmitter<void>(); // New event emitter for toggling done status

  editable = false;

  saveItem(description: string) {
    this.item.description = description;
    this.editable = false;
  }

  onToggleDone() {
    this.toggleDone.emit();
  }
}
