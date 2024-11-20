import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { ExerciseFormComponent } from '../exercise-form/exercise-form.component';
import { ExerciseForm } from '../../../../core/exercises/domain/exercise.model';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ExerciseStore } from '../../../../core/exercises/store/exercise.store';
import { BaseFormPageComponent } from '../../../../core/shared/components/base-form-page/base-form-page.component';
import { createExercise } from '../../../../core/exercises/domain/exercises.domain';

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
        @apply flex flex-grow flex-col items-center md:justify-center;
      }
    `,
  ],
})
export class NewExercisePageComponent extends BaseFormPageComponent<ExerciseFormComponent> {
  child = viewChild.required<ExerciseFormComponent>(ExerciseFormComponent);
  exerciseStore = inject(ExerciseStore);

  save(exerciseForm: ExerciseForm) {
    this.exerciseStore.addExercise(createExercise(exerciseForm));
    this.navigateToParent();
  }

  cancel() {
    this.navigateToParent();
  }
}
