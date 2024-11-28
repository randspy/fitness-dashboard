import { TestBed } from '@angular/core/testing';

import { SessionStoreService } from './session-store.service';
import { SessionStore } from '../../../core/sessions/store/sessions.store';
import {
  generateExercise,
  generateSession,
} from '../../../../tests/test-object-generators';
import { ExerciseStore } from '../../../core/exercises/store/exercise.store';
import { provideTestServices } from '../../../../tests/test-providers';

describe('SessionStoreService', () => {
  let service: SessionStoreService;
  let sessionStore: InstanceType<typeof SessionStore>;
  let exerciseStore: InstanceType<typeof ExerciseStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionStoreService, ...provideTestServices()],
    });

    service = TestBed.inject(SessionStoreService);
    sessionStore = TestBed.inject(SessionStore);
    exerciseStore = TestBed.inject(ExerciseStore);
  });

  afterEach(() => {
    sessionStore.reset();
    exerciseStore.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addSession', () => {
    it('should add session to the store', () => {
      const session = generateSession({
        id: 'session-1',
      });

      service.addSession(session);
      expect(sessionStore.sessions()).toEqual([session]);
    });

    it('should add session id to exercise usage list', () => {
      const session = generateSession({
        id: 'session-1',
        exercises: [
          {
            id: 'session-exercise-1',
            exerciseId: 'exercise-1',
            sets: [],
          },
          {
            id: 'session-exercise-2',
            exerciseId: 'exercise-2',
            sets: [],
          },
        ],
      });

      const exercise1 = generateExercise({
        id: 'exercise-1',
      });

      const exercise2 = generateExercise({
        id: 'exercise-2',
      });

      exerciseStore.setExercises([exercise1, exercise2]);

      service.addSession(session);

      expect(exerciseStore.exercises()[0].usage).toEqual([{ id: 'session-1' }]);
      expect(exerciseStore.exercises()[1].usage).toEqual([{ id: 'session-1' }]);
    });
  });

  describe('updateSession', () => {
    it('should update session in the store', () => {
      sessionStore.setSessions([generateSession({ id: 'session-1' })]);

      service.updateSession(
        'session-1',
        generateSession({
          id: 'session-1',
          name: 'Updated Session',
        }),
      );

      expect(sessionStore.sessions()[0].name).toEqual('Updated Session');
    });

    it('should add session id to exercise usage list', () => {
      sessionStore.setSessions([
        generateSession({
          id: 'session-1',
          exercises: [],
        }),
      ]);

      exerciseStore.setExercises([
        generateExercise({
          id: 'exercise-1',
        }),
      ]);

      service.updateSession(
        'session-1',
        generateSession({
          id: 'session-1',
          exercises: [
            {
              id: 'session-exercise-1',
              exerciseId: 'exercise-1',
              sets: [],
            },
          ],
        }),
      );

      expect(exerciseStore.exercises()[0].usage).toEqual([{ id: 'session-1' }]);
    });

    it('should remove session id from exercise usage list', () => {
      sessionStore.setSessions([
        generateSession({
          id: 'session-1',
          exercises: [
            {
              id: 'session-exercise-1',
              exerciseId: 'exercise-1',
              sets: [],
            },
            {
              id: 'session-exercise-2',
              exerciseId: 'exercise-2',
              sets: [],
            },
          ],
        }),
        generateSession({
          id: 'session-2',
          exercises: [
            {
              id: 'session-exercise-2',
              exerciseId: 'exercise-1',
              sets: [],
            },
          ],
        }),
      ]);

      exerciseStore.setExercises([
        generateExercise({
          id: 'exercise-1',
          usage: [{ id: 'session-1' }, { id: 'session-2' }],
        }),
        generateExercise({
          id: 'exercise-2',
        }),
      ]);

      service.updateSession(
        'session-1',
        generateSession({
          id: 'session-1',
          exercises: [],
        }),
      );

      expect(exerciseStore.exercises()[0].usage).toEqual([{ id: 'session-2' }]);
    });

    it('should combine adding, keeping and removing exercises', () => {
      sessionStore.setSessions([
        generateSession({
          id: 'session-1',
          exercises: [
            {
              id: 'session-exercise-1',
              exerciseId: 'exercise-1',
              sets: [],
            },
            {
              id: 'session-exercise-2',
              exerciseId: 'exercise-2',
              sets: [],
            },
          ],
        }),
        generateSession({
          id: 'session-2',
          exercises: [
            {
              id: 'session-exercise-2',
              exerciseId: 'exercise-1',
              sets: [],
            },
          ],
        }),
      ]);

      exerciseStore.setExercises([
        generateExercise({
          id: 'exercise-1',
          usage: [{ id: 'session-1' }, { id: 'session-2' }],
        }),
        generateExercise({
          id: 'exercise-2',
          usage: [{ id: 'session-1' }],
        }),
        generateExercise({
          id: 'exercise-3',
          usage: [],
        }),
      ]);

      service.updateSession(
        'session-1',
        generateSession({
          id: 'session-1',
          exercises: [
            {
              id: 'session-exercise-2',
              exerciseId: 'exercise-2',
              sets: [],
            },
            {
              id: 'session-exercise-3',
              exerciseId: 'exercise-3',
              sets: [],
            },
          ],
        }),
      );

      expect(exerciseStore.exercises()[0].usage).toEqual([{ id: 'session-2' }]);
      expect(exerciseStore.exercises()[1].usage).toEqual([{ id: 'session-1' }]);
      expect(exerciseStore.exercises()[2].usage).toEqual([{ id: 'session-1' }]);
    });
  });

  describe('removeSession', () => {
    it('should remove session from the store', () => {
      const session = generateSession({
        id: 'session-1',
      });

      sessionStore.setSessions([session]);

      service.removeSession('session-1');
      expect(sessionStore.sessions()).toEqual([]);
    });

    it('should remove session id from exercise usage list', () => {
      const session = generateSession({
        id: 'session-1',
        exercises: [
          {
            id: 'session-exercise-1',
            exerciseId: 'exercise-1',
            sets: [],
          },
          {
            id: 'session-exercise-2',
            exerciseId: 'exercise-2',
            sets: [],
          },
        ],
      });

      sessionStore.setSessions([session]);

      const exercise1 = generateExercise({
        id: 'exercise-1',
        usage: [{ id: 'session-1' }],
      });

      const exercise2 = generateExercise({
        id: 'exercise-2',
        usage: [{ id: 'session-1' }],
      });

      exerciseStore.setExercises([exercise1, exercise2]);

      service.removeSession('session-1');

      expect(exerciseStore.exercises()[0].usage).toEqual([]);
      expect(exerciseStore.exercises()[1].usage).toEqual([]);
    });

    it('should remove exercise if it is hidden and usage is empty', () => {
      const session = generateSession({
        id: 'session-1',
        exercises: [
          {
            id: 'session-exercise-1',
            exerciseId: 'exercise-1',
            sets: [],
          },
        ],
      });

      sessionStore.setSessions([session]);

      const exercise = generateExercise({
        id: 'exercise-1',
        usage: [{ id: 'session-1' }],
        hidden: true,
      });

      exerciseStore.setExercises([exercise]);

      service.removeSession('session-1');

      expect(exerciseStore.exercises()).toEqual([]);
    });
  });

  it('should remove session id from exercise usage list if it is hidden and usage will not be empty after removing session', () => {
    const session1 = generateSession({
      id: 'session-1',
      exercises: [
        {
          id: 'session-exercise-1',
          exerciseId: 'exercise-1',
          sets: [],
        },
      ],
    });

    const session2 = generateSession({
      id: 'session-2',
      exercises: [
        {
          id: 'session-exercise-2',
          exerciseId: 'exercise-1',
          sets: [],
        },
      ],
    });

    sessionStore.setSessions([session1, session2]);

    const exercise = generateExercise({
      id: 'exercise-1',
      usage: [{ id: 'session-1' }, { id: 'session-2' }],
      hidden: true,
    });

    exerciseStore.setExercises([exercise]);

    service.removeSession('session-1');

    expect(exerciseStore.exercises()[0].usage).toEqual([{ id: 'session-2' }]);
  });
});
