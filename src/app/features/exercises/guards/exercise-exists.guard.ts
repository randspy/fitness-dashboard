import { Route } from '@angular/router';
import { inject } from '@angular/core';
import { Router, UrlSegment } from '@angular/router';
import { ExerciseStore } from '../store/exercise.store';

export const exerciseExistsGuard = (route: Route, segments: UrlSegment[]) => {
  const router = inject(Router);
  const exerciseStore = inject(ExerciseStore);

  const id = segments[0]?.path;

  if (exerciseStore.getExerciseById(id)) {
    return true;
  }

  return router.navigate(['/page-not-found']);
};
