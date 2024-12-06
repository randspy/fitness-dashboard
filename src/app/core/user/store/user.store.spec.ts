import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserStore } from './user.store';
import { LocalStorageUserService } from '../services/local-storage-user.service';

describe('UserStore', () => {
  let store: InstanceType<typeof UserStore>;
  let mockLocalStorageUserService: jest.Mocked<LocalStorageUserService>;
  let getUserSpy: jest.Mock;
  let setUserSpy: jest.Mock;

  beforeEach(() => {
    getUserSpy = jest.fn().mockReturnValue({ name: '' });
    setUserSpy = jest.fn();

    mockLocalStorageUserService = {} as jest.Mocked<LocalStorageUserService>;
    Object.defineProperty(mockLocalStorageUserService, 'user', {
      get: getUserSpy,
      set: setUserSpy,
    });

    TestBed.configureTestingModule({
      providers: [
        UserStore,
        {
          provide: LocalStorageUserService,
          useValue: mockLocalStorageUserService,
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
      store = TestBed.inject(UserStore);
    });

    it('should be created', () => {
      expect(store).toBeTruthy();
    });

    it('should initialize with empty name', () => {
      expect(store.name()).toBe('');
    });

    it('should update name', () => {
      store.setName('John');

      expect(store.name()).toBe('John');
    });

    it('should persist name to localStorage when state changes', fakeAsync(() => {
      store.setName('John');

      tick();

      expect(setUserSpy).toHaveBeenCalledWith({ name: 'John' });
    }));

    it('should reset state', () => {
      store.setName('John');

      store.reset();

      expect(store.name()).toBe('');
    });
  });

  it('should load user from localStorage', () => {
    getUserSpy.mockReturnValue({ name: 'John' });

    store = TestBed.inject(UserStore);

    expect(store.name()).toBe('John');
    expect(getUserSpy).toHaveBeenCalled();
  });
});
