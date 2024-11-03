import { signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { effect } from '@angular/core';
import { Exercise } from '../domain/exercise.model';

interface ExercisesState {
  exercises: Exercise[];
}

const initialState: ExercisesState = {
  exercises: [],
};

export const ExerciseStore = signalStore(
  { providedIn: 'root' },
  withDevtools('exercises'),
  withState(initialState),
  withMethods((store) => ({
    addExercise(exercise: Omit<Exercise, 'id'>) {
      updateState(store, 'addExercise', (state) => ({
        ...state,
        exercises: [
          ...state.exercises,
          {
            ...exercise,
            id: crypto.randomUUID(),
          },
        ],
      }));
    },
    removeExercise(id: string) {
      updateState(store, 'removeExercise', (state) => ({
        ...state,
        exercises: state.exercises.filter((exercise) => exercise.id !== id),
      }));
    },
    updateExercise(id: string, exercise: Partial<Omit<Exercise, 'id'>>) {
      updateState(store, 'updateExercise', (state) => ({
        ...state,
        exercises: state.exercises.map((e) =>
          e.id === id ? { ...e, ...exercise } : e,
        ),
      }));
    },
  })),
  withHooks((store) => ({
    onInit() {
      const exercises = localStorage.getItem('exercises');
      if (exercises) {
        updateState(store, 'init', () => ({
          exercises: JSON.parse(exercises),
        }));
      }

      effect(() => {
        localStorage.setItem('exercises', JSON.stringify(store.exercises()));
      });
    },
  })),
);
