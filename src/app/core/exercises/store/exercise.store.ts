import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject } from '@angular/core';
import { Exercise } from '../domain/exercise.types';
import {
  setEntities,
  addEntity,
  removeEntity,
  updateEntity,
  withEntities,
  removeAllEntities,
} from '@ngrx/signals/entities';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { LoggerService } from '../../errors/services/logger.service';
import { ExerciseSchema } from '../domain/exercise.schema';
import { DisplayStateCorruptionToastService } from '../../errors/services/display-state-corruption-toast.service';

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
  withHooks((store) => {
    const loggerService = inject(LoggerService);
    const displayStateCorruptionToastService = inject(
      DisplayStateCorruptionToastService,
    );
    let stateIsValidated = true;

    return {
      onInit() {
        const exercises = localStorage.getItem('exercises');
        if (exercises) {
          try {
            const parsedExercises = JSON.parse(exercises);
            const validatedExercises = z
              .array(ExerciseSchema)
              .parse(parsedExercises);

            updateState(store, 'init', setEntities(validatedExercises));
          } catch (error) {
            stateIsValidated = false;
            displayStateCorruptionToastService.show('Exercises');

            if (error instanceof SyntaxError) {
              loggerService.error(
                `Invalid exercises data : ${error.message}, raw data: "${exercises}"`,
              );
            } else if (error instanceof z.ZodError) {
              loggerService.error(
                `Invalid exercise data structure: ${fromError(error).toString()}`,
              );
            }
          }
        }

        effect(() => {
          if (stateIsValidated) {
            localStorage.setItem(
              'exercises',
              JSON.stringify(store.exercises()),
            );
          }
        });
      },
    };
  }),
);
