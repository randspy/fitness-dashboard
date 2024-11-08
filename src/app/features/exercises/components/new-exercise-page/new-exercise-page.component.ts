import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { ExerciseFormComponent } from '../exercise-form/exercise-form.component';
import { Exercise } from '../../domain/exercise.model';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ExerciseStore } from '../../store/exercise.store';
import { BaseFormPageComponent } from '../../../../core/shared/components/base-form-page/base-form-page.component';

@Component({
  selector: 'fit-new-exercise-page',
  standalone: true,
  imports: [ExerciseFormComponent, ConfirmDialogModule],
  templateUrl: './new-exercise-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
  styles: [
    `
      :host {
        @apply flex flex-grow flex-col items-center justify-center p-4 md:p-20;
      }
    `,
  ],
})
export class NewExercisePageComponent extends BaseFormPageComponent<ExerciseFormComponent> {
  child = viewChild.required<ExerciseFormComponent>(ExerciseFormComponent);
  exerciseStore = inject(ExerciseStore);

  save(exercise: Exercise) {
    this.exerciseStore.addExercise(exercise);
    this.navigateToParent();
  }

  cancel() {
    this.navigateToParent();
  }
}
