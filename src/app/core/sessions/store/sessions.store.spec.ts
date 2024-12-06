import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SessionStore } from './sessions.store';
import { generateSession } from '../../../../tests/test-object-generators';
import { LocalStorageSessionService } from '../services/local-storage-session.service';

describe('SessionStore', () => {
  let store: InstanceType<typeof SessionStore>;
  let mockLocalStorageSessionService: jest.Mocked<LocalStorageSessionService>;
  let getSessionsSpy: jest.Mock;
  let setSessionsSpy: jest.Mock;

  beforeEach(() => {
    getSessionsSpy = jest.fn().mockReturnValue([]);
    setSessionsSpy = jest.fn();

    mockLocalStorageSessionService =
      {} as jest.Mocked<LocalStorageSessionService>;
    Object.defineProperty(mockLocalStorageSessionService, 'sessions', {
      get: getSessionsSpy,
      set: setSessionsSpy,
    });

    TestBed.configureTestingModule({
      providers: [
        SessionStore,
        {
          provide: LocalStorageSessionService,
          useValue: mockLocalStorageSessionService,
        },
      ],
    });
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('With empty initial state', () => {
    beforeEach(() => {
      store = TestBed.inject(SessionStore);
    });

    it('should be created', () => {
      expect(store).toBeTruthy();
    });

    it('should initialize with empty sessions array', () => {
      expect(store.sessions()).toEqual([]);
    });

    it('should add session with generated id', () => {
      const newSession = generateSession({
        id: '1',
      });

      store.addSession(newSession);

      const sessions = store.sessions();
      expect(sessions.length).toBe(1);
      expect(sessions[0]).toEqual(newSession);
    });

    it('should remove session by id', () => {
      const session = generateSession({
        id: '1',
      });

      store.addSession(session);
      const addedSession = store.sessions()[0];

      store.removeSession(addedSession.id);

      expect(store.sessions()).toEqual([]);
    });

    it('should update session', () => {
      const session = generateSession({
        id: '1',
      });

      store.addSession(session);
      const addedSession = store.sessions()[0];

      store.updateSession(addedSession.id, {
        ...addedSession,
        exercises: [{ id: '1', exerciseId: 'exercise-1', sets: [] }],
      });

      expect(store.sessions()[0]).toEqual({
        ...addedSession,
        exercises: [{ id: '1', exerciseId: 'exercise-1', sets: [] }],
      });
    });

    it('should not update session with non-existent id', () => {
      const session = generateSession({
        id: '1',
      });
      store.addSession(session);
      const addedSession = store.sessions()[0];

      store.updateSession('non-existent-id', {
        ...addedSession,
        exercises: [{ id: '1', exerciseId: 'exercise-1', sets: [] }],
      });

      expect(store.sessions()).toEqual([addedSession]);
    });

    it('should persist sessions to localStorage when state changes', fakeAsync(() => {
      const session = generateSession({
        id: '1',
        exercises: [
          {
            id: '1',
            exerciseId: 'exercise-1',
            sets: [],
          },
        ],
      });

      store.addSession(session);

      tick();

      expect(setSessionsSpy).toHaveBeenLastCalledWith([session]);
    }));

    it('should not update non-existent session', () => {
      const session = generateSession({
        id: '1',
      });

      store.addSession(session);
      const initialSessions = store.sessions();

      store.updateSession(
        'non-existent-id',
        generateSession({
          exercises: [{ id: '1', exerciseId: 'exercise-1', sets: [] }],
        }),
      );

      expect(store.sessions()).toEqual(initialSessions);
    });

    it('should reset state', () => {
      store.addSession(generateSession({ id: '1' }));

      store.reset();
      expect(store.sessions()).toEqual([]);
    });

    it('should set sessions', () => {
      const sessions = [generateSession({ id: '1' })];

      store.setSessions(sessions);
      expect(store.sessions()).toEqual(sessions);
    });

    it('should get session by id', () => {
      const session = generateSession({ id: '2' });
      store.setSessions([generateSession({ id: '1' }), session]);

      const result = store.getSessionById('2');
      expect(result).toEqual(session);
    });
  });

  it('should load sessions from localStorage on init', () => {
    const testSessions = [generateSession({ id: '1' })];
    getSessionsSpy.mockReturnValue(testSessions);

    store = TestBed.inject(SessionStore);

    expect(store.sessions()).toEqual(testSessions);
    expect(getSessionsSpy).toHaveBeenCalled();
  });
});
