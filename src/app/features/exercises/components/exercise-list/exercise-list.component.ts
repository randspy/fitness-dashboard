import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ExerciseStore } from '../../store/exercise.store';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { DragDropModule } from 'primeng/dragdrop';
import { Exercise } from '../../domain/exercise.model';
import { DraggableListComponent } from '../../../../ui/components/draggable-list/draggable-list.component';

@Component({
  selector: 'fit-exercise-list',
  standalone: true,
  imports: [CardComponent, DragDropModule, DraggableListComponent],
  templateUrl: './exercise-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        @apply w-full lg:w-192;
      }
    `,
  ],
})
export class ExerciseListComponent {
  exerciseStore = inject(ExerciseStore);
  exercises = this.exerciseStore.exercises;

  exerciseListIsEmpty = computed(
    () => this.exerciseStore.exercises().length === 0,
  );

  onReorder(exercises: Exercise[]) {
    this.exerciseStore.setExercises(exercises);
  }
}
