import { TestBed } from '@angular/core/testing';

import { ExerciseStoreService } from './exercise-store.service';
import { Exercise } from '../../../core/exercises/domain/exercise.model';
import { generateExercise } from '../../../../../setup-jest';
import { ExerciseStore } from '../../../core/exercises/store/exercise.store';

describe('ExerciseStoreService', () => {
  let service: ExerciseStoreService;
  let exerciseStore: InstanceType<typeof ExerciseStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
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
});
