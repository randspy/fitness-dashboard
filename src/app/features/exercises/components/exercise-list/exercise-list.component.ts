import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ExerciseStore } from '../../../../core/exercises/store/exercise.store';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { DragDropModule } from 'primeng/dragdrop';
import { Exercise } from '../../../../core/exercises/domain/exercise.model';
import { DraggableListComponent } from '../../../../ui/components/draggable-list/draggable-list.component';
import { ConfirmationService } from 'primeng/api';
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
    ConfirmationService,
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
  confirmationService = inject(ConfirmationService);

  exercises = this.exerciseStore.displayedExercises;
  exerciseListIsEmpty = this.exerciseStore.isEmpty;

  onReorder(exercises: Exercise[]) {
    this.exerciseStore.setExercises(exercises);
  }

  confirmDeleteExercise(id: string) {
    this.confirmationService.confirm({
      header: 'Delete exercise',
      message: 'Are you sure you want to delete this session?',
      accept: () => {
        this.exerciseStoreService.removeExercise(id);
      },
    });
  }
}
