import { TestBed } from '@angular/core/testing';

import { ExerciseStoreService } from './exercise-store.service';
import { Exercise } from '../../../core/exercises/domain/exercise.types';
import { generateExercise } from '../../../../tests/test-object-generators';
import { ExerciseStore } from '../../../core/exercises/store/exercise.store';
import { provideTestServices } from '../../../../tests/test-providers';

describe('ExerciseStoreService', () => {
  let service: ExerciseStoreService;
  let exerciseStore: InstanceType<typeof ExerciseStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExerciseStoreService, ...provideTestServices()],
    });
    service = TestBed.inject(ExerciseStoreService);
    exerciseStore = TestBed.inject(ExerciseStore);
  });

  afterEach(() => {
    exerciseStore.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('removeExercise', () => {
    it('should remove exercise by id if exercise is not used', () => {
      const exercise: Exercise = generateExercise({
        id: 'exercise-1',
        usage: [],
      });

      exerciseStore.setExercises([exercise]);
      service.removeExercise(exercise.id);

      expect(exerciseStore.exercises()).toEqual([]);
    });

    it('should hide exercise if it is used', () => {
      const exercise: Exercise = generateExercise({
        id: 'exercise-1',
        usage: [{ id: 'session-1' }],
        hidden: false,
      });

      exerciseStore.setExercises([exercise]);
      service.removeExercise(exercise.id);

      expect(exerciseStore.exercises()).toEqual([
        {
          ...exercise,
          hidden: true,
        },
      ]);
    });
  });

  describe('addExercise', () => {
    it('should add exercise to store', () => {
      const exercise: Exercise = generateExercise({
        id: 'exercise-1',
      });

      exerciseStore.setExercises([exercise]);

      const exerciseToAdd: Exercise = generateExercise({
        id: 'exercise-2',
      });
      service.addExercise(exerciseToAdd);

      expect(exerciseStore.exercises()).toEqual([
        {
          ...exercise,
          position: 0,
        },
        {
          ...exerciseToAdd,
          position: 1,
        },
      ]);
    });

    it('should increment position of the exercise with biggest position', () => {
      const exercise: Exercise = generateExercise({
        id: 'exercise-1',
        position: 41,
      });

      exerciseStore.setExercises([exercise]);
      service.addExercise({
        id: 'exercise-2',
        name: 'Exercise 2',
        description: 'Description 2',
      });

      expect(exerciseStore.exercises()[1].position).toBe(42);
    });
  });

  describe('reorderExercises', () => {
    it('should reorder exercises', () => {
      const exercises = [
        generateExercise({ id: 'exercise-1' }),
        generateExercise({ id: 'exercise-2' }),
      ];

      service.reorderExercises(exercises);

      expect(exerciseStore.exercises()).toEqual([
        {
          ...exercises[0],
          position: 0,
        },
        {
          ...exercises[1],
          position: 1,
        },
      ]);
    });
  });

  describe('updateExercise', () => {
    it('should update exercise', () => {
      const exercise = generateExercise({ id: 'exercise-1' });
      exerciseStore.setExercises([exercise]);

      const updatedExercise = generateExercise({
        id: 'exercise-1',
        name: 'Updated Exercise',
      });
      service.updateExercise(exercise.id, updatedExercise);

      expect(exerciseStore.exercises()).toEqual([updatedExercise]);
    });

    it('should not update exercise if it does not exist', () => {
      const exercise = generateExercise({ id: 'exercise-1' });
      exerciseStore.setExercises([exercise]);

      service.updateExercise('exercise-2', exercise);

      expect(exerciseStore.exercises()).toEqual([exercise]);
    });
  });

  describe('sortedVisibleExercises', () => {
    it('should return sorted visible exercises', () => {
      const exercises = [
        generateExercise({ id: 'exercise-1', hidden: false, position: 2 }),
        generateExercise({ id: 'exercise-2', hidden: true, position: 1 }),
        generateExercise({ id: 'exercise-3', hidden: false, position: 0 }),
      ];

      exerciseStore.setExercises(exercises);

      expect(service.sortedVisibleExercises()).toEqual([
        exercises[2],
        exercises[0],
      ]);
    });
  });
});
