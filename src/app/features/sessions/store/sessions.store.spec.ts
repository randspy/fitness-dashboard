import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SessionStore } from './sessions.store';

describe('SessionStore', () => {
  let store: InstanceType<typeof SessionStore>;
  let localStorageSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionStore],
    });

    localStorageSpy = jest.spyOn(Storage.prototype, 'setItem');
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
      const newSession = {
        id: crypto.randomUUID(),
        date: new Date(),
        exercises: [],
      };

      store.addSession(newSession);

      const sessions = store.sessions();
      expect(sessions.length).toBe(1);
      expect(sessions[0]).toEqual(newSession);
    });

    it('should remove session by id', () => {
      const session = {
        id: '1',
        date: new Date(),
        exercises: [],
      };
      store.addSession(session);
      const addedSession = store.sessions()[0];

      store.removeSession(addedSession.id);

      expect(store.sessions()).toEqual([]);
    });

    it('should update session', () => {
      const session = {
        id: '1',
        date: new Date(),
        exercises: [],
      };
      store.addSession(session);
      const addedSession = store.sessions()[0];

      store.updateSession(addedSession.id, {
        exercises: [{ id: '1', name: 'Push-ups', sets: [] }],
      });

      expect(store.sessions()[0]).toEqual({
        ...addedSession,
        exercises: [{ id: '1', name: 'Push-ups', sets: [] }],
      });
    });

    it('should persist sessions to localStorage when state changes', fakeAsync(() => {
      const session = {
        id: '1',
        date: new Date(),
        exercises: [
          {
            id: '1',
            name: 'Push-ups',
            sets: [],
          },
        ],
      };

      store.addSession(session);

      tick();

      expect(localStorageSpy).toHaveBeenLastCalledWith(
        'sessions',
        expect.stringContaining('Push-ups'),
      );
    }));

    it('should not update non-existent session', () => {
      const session = {
        id: '1',
        date: new Date(),
        exercises: [],
      };
      store.addSession(session);
      const initialSessions = store.sessions();

      store.updateSession('non-existent-id', {
        exercises: [{ id: '1', name: 'Pull-ups', sets: [] }],
      });

      expect(store.sessions()).toEqual(initialSessions);
    });
  });

  it('should load sessions from localStorage on init', () => {
    const testSessions = [
      {
        id: '1',
        date: new Date(),
        exercises: [{ id: '1', name: 'Push-ups', sets: [] }],
      },
    ];
    localStorage.setItem('sessions', JSON.stringify(testSessions));

    store = TestBed.inject(SessionStore);

    expect(store.sessions()).toEqual(testSessions);
  });

  it('should reset state', () => {
    store.addSession({
      id: '1',
      date: new Date(),
      exercises: [],
    });

    store.reset();
    expect(store.sessions()).toEqual([]);
  });

  it('should set sessions', () => {
    store.setSessions([{ id: '1', date: new Date(), exercises: [] }]);
    expect(store.sessions()).toEqual([
      { id: '1', date: new Date(), exercises: [] },
    ]);
  });
});
