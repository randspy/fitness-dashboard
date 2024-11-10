import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserStore } from './user.store';

describe('UserStore', () => {
  let store: InstanceType<typeof UserStore>;
  let localStorageSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserStore],
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

  it('should load user from localStorage on init', () => {
    const testUser = { name: 'John' };
    localStorage.setItem('user', JSON.stringify(testUser));

    store = TestBed.inject(UserStore);

    expect(store.name()).toBe('John');
  });
});
