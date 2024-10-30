import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExerciseFormComponent } from '../exercise-form/exercise-form.component';

@Component({
  selector: 'fit-new-exercise-page',
  standalone: true,
  imports: [ExerciseFormComponent],
  templateUrl: './new-exercise-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        @apply flex flex-grow flex-col items-center justify-center p-4 md:p-20;
      }
    `,
  ],
})
export class NewExercisePageComponent {}
