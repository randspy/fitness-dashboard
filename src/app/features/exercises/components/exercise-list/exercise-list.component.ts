import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ExerciseStore } from '../../../../core/exercises/store/exercise.store';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { DragDropModule } from 'primeng/dragdrop';
import { Exercise } from '../../../../core/exercises/domain/exercise.types';
import { DraggableListComponent } from '../../../../ui/components/draggable-list/draggable-list.component';
import { ConfirmationDialogService } from '../../../../ui/services/confirmation-dialog.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucidePencil, lucideTrash } from '@ng-icons/lucide';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonComponent } from '../../../../ui/components/button/button.component';
import { LinkComponent } from '../../../../ui/components/link/link.component';
import { ExerciseStoreService } from '../../services/exercise-store.service';

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
    LinkComponent,
  ],
  templateUrl: './exercise-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ConfirmationDialogService,
    provideIcons({
      lucideTrash,
      lucidePencil,
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
  exerciseStoreService = inject(ExerciseStoreService);
  confirmationDialogService = inject(ConfirmationDialogService);

  exercises = this.exerciseStoreService.sortedVisibleExercises;
  exerciseListIsEmpty = this.exerciseStore.isEmpty;

  onReorder(exercises: Exercise[]) {
    this.exerciseStoreService.reorderExercises(exercises);
  }

  confirmDeleteExercise(id: string) {
    this.confirmationDialogService.show({
      header: 'Delete exercise',
      message: 'Are you sure you want to delete this session?',
      accept: () => {
        this.exerciseStoreService.removeExercise(id);
      },
    });
  }

  editExerciseLabel(name: string) {
    return `Edit ${name} exercise`;
  }

  deleteExerciseLabel(name: string) {
    return `Delete ${name} exercise`;
  }
}
