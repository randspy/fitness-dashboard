import { Exercise, ExerciseForm } from './exercise.model';
import { createExercise, updateExercise } from './exercises.domain';

describe('Exercises Domain', () => {
  describe('createExercise', () => {
    it('should add usage to the form', () => {
      const form: ExerciseForm = {
        id: '1',
        name: 'Push-ups',
        description: 'Basic push-ups',
      };

      const result = createExercise(form);

      expect(result).toEqual({ ...form, usage: [] });
    });
  });

  describe('updateExercise', () => {
    it('should merge form data with existing exercise', () => {
      const existingExercise: Exercise = {
        id: 'exercise-1',
        name: 'Push-ups',
        description: 'Basic push-ups',
        usage: [
          {
            id: 'session-1',
          },
        ],
      };

      const form: ExerciseForm = {
        id: 'exercise-1',
        name: 'Advanced Push-ups',
        description: 'Advanced push-ups',
      };

      const result = updateExercise(existingExercise, form);

      expect(result).toEqual({ ...existingExercise, ...form });
    });

    it('should create a new exercise if not found', () => {
      const form: ExerciseForm = {
        id: 'exercise-1',
        name: 'Advanced Push-ups',
        description: 'Advanced push-ups',
      };

      const result = updateExercise(undefined, form);

      expect(result).toEqual({ ...form, usage: [] });
    });
  });
});
