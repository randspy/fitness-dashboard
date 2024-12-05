import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserStore } from './user.store';
import { LoggerService } from '../../errors/services/logger.service';
import { mockLoggerService } from '../../../../tests/mock-logger-service';
import { mockDisplayStateCorruptionToastService } from '../../../../tests/mock-display-state-corruption-toast';
import { DisplayStateCorruptionToastService } from '../../errors/services/display-state-corruption-toast.service';

describe('UserStore', () => {
  let store: InstanceType<typeof UserStore>;
  let localStorageSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserStore,
        {
          provide: DisplayStateCorruptionToastService,
          useValue: mockDisplayStateCorruptionToastService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    });

    localStorageSpy = jest.spyOn(Storage.prototype, 'setItem');
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
      expect(localStorageSpy).toHaveBeenLastCalledWith(
        'user',
        JSON.stringify({ name: 'John' }),
      );
    }));

    it('should reset state', () => {
      store.setName('John');

      store.reset();

      expect(store.name()).toBe('');
    });
  });

  it('should load user from localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'John' }));

    store = TestBed.inject(UserStore);

    expect(store.name()).toBe('John');
  });

  it('should save user to localStorage', fakeAsync(() => {
    store = TestBed.inject(UserStore);
    store.setName('John');

    tick();
    expect(localStorageSpy).toHaveBeenLastCalledWith(
      'user',
      JSON.stringify({ name: 'John' }),
    );
  }));
});
