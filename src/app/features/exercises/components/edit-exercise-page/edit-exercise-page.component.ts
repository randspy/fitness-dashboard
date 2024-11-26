import {
  computed,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ExerciseFormComponent } from '../exercise-form/exercise-form.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BaseFormPageComponent } from '../../../../core/shared/components/base-form-page/base-form-page.component';
import { ExerciseStore } from '../../../../core/exercises/store/exercise.store';
import { ExerciseForm } from '../../../../core/exercises/domain/exercise.types';
import { updateExercise } from '../../../../core/exercises/domain/exercises.domain';

@Component({
  selector: 'fit-edit-exercise-page',
  standalone: true,
  imports: [ExerciseFormComponent, ConfirmDialogModule],
  templateUrl: './edit-exercise-page.component.html',
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
export class EditExercisePageComponent extends BaseFormPageComponent<ExerciseFormComponent> {
  child = viewChild.required<ExerciseFormComponent>(ExerciseFormComponent);
  exerciseStore = inject(ExerciseStore);

  id = input.required<string>();

  exercise = computed(() => {
    return this.exerciseStore.getExerciseById(this.id());
  });

  save(exerciseForm: ExerciseForm) {
    this.exerciseStore.updateExercise(
      this.id(),
      updateExercise(this.exercise(), exerciseForm),
    );
    this.navigateToParent();
  }

  cancel() {
    this.navigateToParent();
  }
}
