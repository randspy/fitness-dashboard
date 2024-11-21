import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, effect } from '@angular/core';
import { Exercise } from '../domain/exercise.model';

interface ExercisesState {
  exercises: Exercise[];
}

export const initialState: ExercisesState = {
  exercises: [],
};

export const ExerciseStore = signalStore(
  { providedIn: 'root' },
  withDevtools('exercises'),
  withState(initialState),
  withComputed((store) => ({
    isEmpty: computed(() => store.exercises().length === 0),
    displayedExercises: computed(() =>
      store.exercises().filter((exercise) => !exercise.hidden),
    ),
  })),
  withMethods((store) => ({
    getExerciseById: (id: string) =>
      store.exercises().find((exercise) => exercise.id === id),
    addExercise(exercise: Exercise) {
      updateState(store, 'addExercise', (state) => ({
        ...state,
        exercises: [...state.exercises, { ...exercise }],
      }));
    },
    removeExercise(id: string) {
      updateState(store, 'removeExercise', (state) => ({
        ...state,
        exercises: state.exercises.filter((exercise) => exercise.id !== id),
      }));
    },
    updateExercise(id: string, exercise: Exercise) {
      updateState(store, 'updateExercise', (state) => ({
        ...state,
        exercises: state.exercises.map((e) =>
          e.id === id ? { ...e, ...exercise } : e,
        ),
      }));
    },
    setExercises(exercises: Exercise[]) {
      updateState(store, 'setExercises', (state) => ({
        ...state,
        exercises: [...exercises],
      }));
    },
    reset() {
      patchState(store, initialState);
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
