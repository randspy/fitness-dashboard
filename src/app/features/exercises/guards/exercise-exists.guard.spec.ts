import { TestBed } from '@angular/core/testing';
import { Route, Router, UrlSegment } from '@angular/router';
import { generateExercise } from '../../../../tests/test-object-generators';
import { exerciseExistsGuard } from './exercise-exists.guard';
import { ExerciseStore } from '../../../core/exercises/store/exercise.store';
import { provideTestLogger } from '../../../../tests/provide-test-logger';

describe('exerciseExistsGuard', () => {
  let exerciseStore: InstanceType<typeof ExerciseStore>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExerciseStore,
        provideTestLogger(),
        {
          provide: Router,
          useValue: {
            navigate: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    });

    exerciseStore = TestBed.inject(ExerciseStore);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    jest.clearAllMocks();
    exerciseStore.reset();
  });

  it('should allow navigation when exercise exists', () => {
    const testExercise = generateExercise({ id: '123' });

    exerciseStore.setExercises([testExercise]);

    const result = TestBed.runInInjectionContext(() =>
      exerciseExistsGuard({} as Route, [{ path: '123' } as UrlSegment]),
    );

    expect(result).toBe(true);
  });

  it('should redirect to page not found when exercise does not exist', () => {
    TestBed.runInInjectionContext(() =>
      exerciseExistsGuard({} as Route, [{ path: '123' } as UrlSegment]),
    );

    expect(router.navigate).toHaveBeenCalledWith(['/page-not-found']);
  });

  it('should redirect to page not found when path does not exist', () => {
    const testExercise = generateExercise({ id: '123' });
    exerciseStore.addExercise(testExercise);

    TestBed.runInInjectionContext(() => exerciseExistsGuard({} as Route, []));

    expect(router.navigate).toHaveBeenCalledWith(['/page-not-found']);
  });
});
