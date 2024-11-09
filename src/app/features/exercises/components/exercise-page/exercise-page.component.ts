import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LinkComponent } from '../../../../ui/components/link/link.component';
import { ExerciseListComponent } from '../exercise-list/exercise-list.component';
import { PageSkeletonComponent } from '../../../../ui/components/page-skeleton/page-skeleton.component';

@Component({
  selector: 'fit-exercise-page',
  standalone: true,
  imports: [LinkComponent, ExerciseListComponent, PageSkeletonComponent],
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
