import { Routes } from '@angular/router';
import { NewExercisePageComponent } from './components/new-exercise-page/new-exercise-page.component';
import { ExercisePageComponent } from './components/exercise-page/exercise-page.component';

export const exercisesRoutes: Routes = [
  {
    path: '',
    component: ExercisePageComponent,
  },
  {
    path: 'new',
    component: NewExercisePageComponent,
  },
];
