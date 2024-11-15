import { Routes } from '@angular/router';
import { NewExercisePageComponent } from './components/new-exercise-page/new-exercise-page.component';
import { ExercisePageComponent } from './components/exercise-page/exercise-page.component';
import { unsavedChangesGuard } from '../../core/shared/guards/unsaved-changes.guard';
import { EditExercisePageComponent } from './components/edit-exercise-page/edit-exercise-page.component';
import { exerciseExistsGuard } from './guards/exercise-exists.guard';

export const exercisesRoutes: Routes = [
  {
    path: '',
    component: ExercisePageComponent,
  },
  {
    path: 'new',
    canDeactivate: [unsavedChangesGuard],
    component: NewExercisePageComponent,
  },
  {
    path: ':id',
    component: EditExercisePageComponent,
    canMatch: [exerciseExistsGuard],
    canDeactivate: [unsavedChangesGuard],
  },
];
