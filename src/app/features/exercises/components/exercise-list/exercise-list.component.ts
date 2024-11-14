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
import { ConfirmationService } from 'primeng/api';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideTrash } from '@ng-icons/lucide';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonComponent } from '../../../../ui/components/button/button.component';

@Component({
  selector: 'fit-exercise-list',
  standalone: true,
  imports: [
    CardComponent,
    ButtonComponent,
    DragDropModule,
    DraggableListComponent,
    ConfirmDialogModule,
    NgIconComponent,
  ],
  templateUrl: './exercise-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ConfirmationService,
    provideIcons({
      lucideTrash,
    }),
  ],
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
  confirmationService = inject(ConfirmationService);

  exercises = this.exerciseStore.exercises;

  exerciseListIsEmpty = computed(
    () => this.exerciseStore.exercises().length === 0,
  );

  onReorder(exercises: Exercise[]) {
    this.exerciseStore.setExercises(exercises);
  }

  confirmDeleteExercise(id: string) {
    this.confirmationService.confirm({
      header: 'Delete exercise',
      message: 'Are you sure you want to delete this session?',
      accept: () => {
        this.exerciseStore.removeExercise(id);
      },
    });
  }
}
