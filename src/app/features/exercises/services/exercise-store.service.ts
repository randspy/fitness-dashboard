import { inject, Injectable } from '@angular/core';
import { ExerciseStore } from '../../../core/exercises/store/exercise.store';

@Injectable({
  providedIn: 'root',
})
export class ExerciseStoreService {
  exerciseStore = inject(ExerciseStore);

  removeExercise(id: string) {
    const exercise = this.exerciseStore.getExerciseById(id);
    if (exercise) {
      if (exercise.usage.length === 0) {
        this.exerciseStore.removeExercise(id);
      } else {
        this.exerciseStore.updateExercise(id, { ...exercise, hidden: true });
      }
    }
  }
}
