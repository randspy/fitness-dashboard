import { inject, Injectable } from '@angular/core';
import { LoggerService } from '../../errors/services/logger.service';
import { DisplayStateCorruptionToastService } from '../../errors/services/display-state-corruption-toast.service';
import { ExerciseSchema } from '../domain/exercise.schema';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { Exercise } from '../domain/exercise.types';
import { exercisesLocalStorageKey } from '../../shared/domain/local-storage.config';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageExerciseService {
  private loggerService = inject(LoggerService);
  private displayStateCorruptionToastService = inject(
    DisplayStateCorruptionToastService,
  );

  private stateIsValidated = true;

  get exercises(): Exercise[] {
    const exerciseList = localStorage.getItem(exercisesLocalStorageKey);
    if (exerciseList) {
      try {
        const parsedExercises = JSON.parse(exerciseList);
        const validatedExercises = z
          .array(ExerciseSchema)
          .parse(parsedExercises);

        return validatedExercises;
      } catch (error) {
        this.stateIsValidated = false;
        this.displayStateCorruptionToastService.show('Exercises');

        if (error instanceof SyntaxError) {
          this.loggerService.error(
            `Invalid exercises data : ${error.message}, raw data: "${exerciseList}"`,
          );
        } else if (error instanceof z.ZodError) {
          this.loggerService.error(
            `Invalid exercise data structure: ${fromError(error).toString()}`,
          );
        }
      }
    }

    return [];
  }

  set exercises(exerciseList: Exercise[]) {
    if (this.stateIsValidated) {
      localStorage.setItem(
        exercisesLocalStorageKey,
        JSON.stringify(exerciseList),
      );
    }
  }
}
