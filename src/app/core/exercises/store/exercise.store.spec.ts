import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ExerciseStore } from './exercise.store';
import { generateExercise } from '../../../../../setup-jest';

describe('ExerciseStore', () => {
  let store: InstanceType<typeof ExerciseStore>;
  let localStorageSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExerciseStore],
    });

    localStorageSpy = jest.spyOn(Storage.prototype, 'setItem');
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('With empty initial state', () => {
    beforeEach(() => {
      store = TestBed.inject(ExerciseStore);
    });

    it('should be created', () => {
      expect(store).toBeTruthy();
    });

    it('should initialize with empty exercises array', () => {
      expect(store.exercises()).toEqual([]);
    });

    it('should add exercise with generated id', () => {
      const id = '1-2-3-4-5';
      jest.spyOn(crypto, 'randomUUID').mockReturnValue(id);
      const newExercise = generateExercise({
        id,
      });

      store.addExercise(newExercise);

      const exercises = store.exercises();
      expect(exercises.length).toBe(1);
      expect(exercises[0]).toEqual({
        ...newExercise,
        id,
      });
    });

    it('should remove exercise by id', () => {
      const exercise = generateExercise({
        id: '1',
      });
      store.addExercise(exercise);
      const addedExercise = store.exercises()[0];

      store.removeExercise(addedExercise.id);

      expect(store.exercises()).toEqual([]);
    });

    it('should update exercise', () => {
      const exercise = generateExercise({
        id: '1',
      });
      store.addExercise(exercise);
      const addedExercise = store.exercises()[0];

      store.updateExercise(addedExercise.id, { name: 'Advanced Push-ups' });

      expect(store.exercises()[0]).toEqual({
        ...addedExercise,
        name: 'Advanced Push-ups',
      });
    });

    it('should persist exercises to localStorage when state changes', fakeAsync(() => {
      const exercise = generateExercise({
        id: '1',
        name: 'Push-ups',
      });

      store.addExercise(exercise);

      tick();

      expect(localStorageSpy).toHaveBeenLastCalledWith(
        'exercises',
        expect.stringContaining('Push-ups'),
      );
    }));

    it('should not update non-existent exercise', () => {
      const exercise = generateExercise({
        id: '1',
        name: 'Push-ups',
      });
      store.addExercise(exercise);
      const initialExercises = store.exercises();

      store.updateExercise('non-existent-id', { name: 'Advanced Push-ups' });

      expect(store.exercises()).toEqual(initialExercises);
    });

    it('should reset state', () => {
      store.addExercise(
        generateExercise({
          id: '1',
        }),
      );

      store.reset();
      expect(store.exercises()).toEqual([]);
    });

    describe('With computed', () => {
      it('should return true if exercises array is empty', () => {
        expect(store.isEmpty()).toBe(true);
      });

      it('should return false if exercises array is not empty', () => {
        store.addExercise(
          generateExercise({
            id: '1',
          }),
        );

        expect(store.isEmpty()).toBe(false);
      });
    });

    it('should get exercise by id', () => {
      store.setExercises([
        generateExercise({
          id: '1',
        }),
        generateExercise({
          id: '2',
        }),
      ]);

      expect(store.getExerciseById('2')).toEqual(
        generateExercise({
          id: '2',
        }),
      );
    });
  });

  it('should load exercises from localStorage on init', () => {
    const testExercises = [
      generateExercise({
        id: '1',
      }),
    ];
    localStorage.setItem('exercises', JSON.stringify(testExercises));

    store = TestBed.inject(ExerciseStore);

    expect(store.exercises()).toEqual(testExercises);
  });
});
