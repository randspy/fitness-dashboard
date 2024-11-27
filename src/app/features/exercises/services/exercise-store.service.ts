import { computed, inject, Injectable } from '@angular/core';
import { ExerciseStore } from '../../../core/exercises/store/exercise.store';
import {
  Exercise,
  ExerciseForm,
} from '../../../core/exercises/domain/exercise.types';

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

  addExercise(exercise: ExerciseForm) {
    const biggestPosition = this.exerciseStore
      .exercises()
      .reduce((max, exercise) => Math.max(max, exercise.position), 0);

    this.exerciseStore.addExercise({
      ...exercise,
      usage: [],
      hidden: false,
      position: biggestPosition + 1,
    });
  }

  reorderExercises(exercises: Exercise[]) {
    const exercisesWithPosition = exercises.map((exercise, index) => ({
      ...exercise,
      position: index,
    }));

    this.exerciseStore.setExercises(exercisesWithPosition);
  }

  updateExercise(id: string, exerciseForm: ExerciseForm) {
    const exercise = this.exerciseStore.getExerciseById(id);
    if (exercise) {
      this.exerciseStore.updateExercise(id, {
        ...exercise,
        ...exerciseForm,
      });
    }
  }

  sortedVisibleExercises = computed(() =>
    this.exerciseStore
      .exercises()
      .filter((exercise) => !exercise.hidden)
      .toSorted((a, b) => a.position - b.position),
  );
}
