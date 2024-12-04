import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { ExerciseFormComponent } from '../exercise-form/exercise-form.component';
import { ExerciseForm } from '../../../../core/exercises/domain/exercise.types';

import { BaseFormPageComponent } from '../../../../core/shared/components/base-form-page/base-form-page.component';
import { ExerciseStoreService } from '../../services/exercise-store.service';
import { ConfirmationDialogService } from '../../../../ui/services/confirmation-dialog.service';
import { ConfirmationDialogComponent } from '../../../../ui/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'fit-new-exercise-page',
  standalone: true,
  imports: [ExerciseFormComponent, ConfirmationDialogComponent],
  templateUrl: './new-exercise-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationDialogService],
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
  exerciseStoreService = inject(ExerciseStoreService);

  save(exerciseForm: ExerciseForm) {
    this.exerciseStoreService.addExercise(exerciseForm);
    this.navigateToParent();
  }

  cancel() {
    this.navigateToParent();
  }
}
