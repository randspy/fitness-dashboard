import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { ExerciseFormComponent } from '../exercise-form/exercise-form.component';
import { Observable, Observer } from 'rxjs';
import { Exercise } from '../../domain/exercise.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ExerciseStore } from '../../store/exercise.store';

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
export class NewExercisePageComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);

  child = viewChild.required<ExerciseFormComponent>(ExerciseFormComponent);
  confirmationService = inject(ConfirmationService);
  exerciseStore = inject(ExerciseStore);

  canDeactivate(): Observable<boolean> | boolean {
    if (this.child().canDeactivate()) {
      return true;
    }

    return new Observable<boolean>((observer: Observer<boolean>) => {
      this.confirmationService.confirm({
        header: 'You have unsaved changes',
        message: 'Are you sure you want to leave this page?',
        accept: () => {
          observer.next(true);
          observer.complete();
        },
        reject: () => {
          observer.next(false);
          observer.complete();
        },
      });
    });
  }

  save(exercise: Exercise) {
    this.exerciseStore.addExercise(exercise);
    this.navigateToParent();
  }

  cancel() {
    this.navigateToParent();
  }

  navigateToParent() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
