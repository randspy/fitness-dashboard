import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { DragDropModule } from 'primeng/dragdrop';

@Component({
  selector: 'fit-draggable-list',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './draggable-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraggableListComponent<T extends { id: string }> {
  contentTemplate = input.required<TemplateRef<{ $implicit: T }>>();
  items = input.required<T[]>();
  draggedItem = signal<T | null>(null);
  itemsChanged = output<T[]>();

  dragStart(item: T) {
    this.draggedItem.set(item);
  }

  drop(index: number) {
    const items = [...this.items()];
    const currentIndex = items.findIndex(
      (item) => item.id === this.draggedItem()?.id,
    );

    items.splice(currentIndex, 1);
    items.splice(index, 0, this.draggedItem()!);

    this.itemsChanged.emit(items);
  }
}
