import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, effect } from '@angular/core';
import { Exercise } from '../domain/exercise.types';
import {
  setEntities,
  addEntity,
  removeEntity,
  updateEntity,
  withEntities,
  removeAllEntities,
} from '@ngrx/signals/entities';

export const ExerciseStore = signalStore(
  { providedIn: 'root' },
  withDevtools('exercises'),
  withEntities<Exercise>(),
  withComputed(({ entities }) => ({
    exercises: computed(() => entities()),
    length: computed(() => entities().length),
    isEmpty: computed(() => entities().length === 0),
  })),
  withMethods((store) => ({
    getExerciseById: (id: string) => store.entityMap()[id],
    addExercise(exercise: Exercise) {
      updateState(store, 'addExercise', addEntity(exercise));
    },
    removeExercise(id: string) {
      updateState(store, 'removeExercise', removeEntity(id));
    },
    updateExercise(id: string, exercise: Exercise) {
      updateState(
        store,
        'updateExercise',
        updateEntity({ id, changes: exercise }),
      );
    },
    setExercises(exercises: Exercise[]) {
      updateState(store, 'setExercises', setEntities(exercises));
    },
    reset() {
      updateState(store, 'reset', removeAllEntities());
    },
  })),
  withHooks((store) => ({
    onInit() {
      const exercises = localStorage.getItem('exercises');
      if (exercises) {
        updateState(store, 'init', setEntities(JSON.parse(exercises)));
      }

      effect(() => {
        localStorage.setItem('exercises', JSON.stringify(store.exercises()));
      });
    },
  })),
);
