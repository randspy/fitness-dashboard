import { TestBed } from '@angular/core/testing';

import { LocalStorageExerciseService } from './local-storage-exercise.service';
import { mockDisplayStateCorruptionToastService } from '../../../../tests/mock-display-state-corruption-toast';
import { DisplayStateCorruptionToastService } from '../../errors/services/display-state-corruption-toast.service';
import { generateExercise } from '../../../../tests/test-object-generators';
import { mockLoggerService } from '../../../../tests/mock-logger-service';
import { LoggerService } from '../../errors/services/logger.service';
import { exercisesLocalStorageKey } from '../../shared/domain/local-storage.config';

describe('LocalStorageService', () => {
  let service: LocalStorageExerciseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LoggerService, useValue: mockLoggerService },
        {
          provide: DisplayStateCorruptionToastService,
          useValue: mockDisplayStateCorruptionToastService,
        },
      ],
    });
    service = TestBed.inject(LocalStorageExerciseService);
  });

  afterEach(() => {
    localStorage.removeItem('exercises');
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get exercises from localStorage', () => {
    localStorage.setItem(
      exercisesLocalStorageKey,
      JSON.stringify([generateExercise({ id: '1' })]),
    );

    expect(service.exercises).toEqual([generateExercise({ id: '1' })]);
  });

  it('should return an empty array if no exercises are found in localStorage', () => {
    expect(service.exercises).toEqual([]);
  });

  it('should handle invalid json data', () => {
    localStorage.setItem(exercisesLocalStorageKey, 'invalid-data');

    expect(service.exercises).toEqual([]);
    expect(mockLoggerService.error).toHaveBeenCalledWith(
      'Invalid exercises data : Unexpected token \'i\', "invalid-data" is not valid JSON, raw data: "invalid-data"',
    );
  });

  it('should handle invalid exercise data structure', () => {
    localStorage.setItem(
      exercisesLocalStorageKey,
      JSON.stringify([{ invalid: 'data' }]),
    );

    expect(service.exercises).toEqual([]);
    expect(mockLoggerService.error).toHaveBeenCalledWith(
      'Invalid exercise data structure: Validation error: Required at "[0].id"; Required at "[0].name"; Required at "[0].description"; Required at "[0].usage"; Required at "[0].hidden"; Required at "[0].position"',
    );
  });

  it('should show error toast', () => {
    localStorage.setItem(
      exercisesLocalStorageKey,
      JSON.stringify([{ invalid: 'data' }]),
    );

    expect(service.exercises).toEqual([]);
    expect(mockDisplayStateCorruptionToastService.show).toHaveBeenCalledWith(
      'Exercises',
    );
  });

  it('should set exercises to localStorage', () => {
    const exercises = [generateExercise({ id: '1' })];
    service.exercises = exercises;

    expect(localStorage.getItem(exercisesLocalStorageKey)).toEqual(
      JSON.stringify(exercises),
    );
  });

  it('should not save localStorage if it was invalid before setting new exercises', () => {
    localStorage.setItem(
      exercisesLocalStorageKey,
      JSON.stringify([{ invalid: 'data' }]),
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unusedValue = service.exercises;

    service.exercises = [generateExercise({ id: '1' })];

    expect(localStorage.getItem(exercisesLocalStorageKey)).toEqual(
      JSON.stringify([{ invalid: 'data' }]),
    );
  });
});
