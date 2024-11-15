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
import { ExerciseStore } from '../../store/exercise.store';
import { Exercise } from '../../domain/exercise.model';

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

  save(exercise: Exercise) {
    this.exerciseStore.updateExercise(this.id(), exercise);
    this.navigateToParent();
  }

  cancel() {
    this.navigateToParent();
  }
}
