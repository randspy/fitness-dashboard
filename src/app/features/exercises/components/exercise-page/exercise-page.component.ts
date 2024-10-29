import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from '../../../../ui/components/button/button.component';

@Component({
  selector: 'fit-exercise-page',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './exercise-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        @apply flex flex-grow flex-col;
      }
    `,
  ],
})
export class ExercisePageComponent {}
