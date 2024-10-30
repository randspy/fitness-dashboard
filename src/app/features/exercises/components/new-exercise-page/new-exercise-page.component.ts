import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fit-new-exercise-page',
  standalone: true,
  imports: [],
  templateUrl: './new-exercise-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewExercisePageComponent {}
