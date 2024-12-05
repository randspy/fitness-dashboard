import { TestBed } from '@angular/core/testing';

import { LocalStorageUserService } from './local-storage-user.service';
import { LoggerService } from '../../errors/services/logger.service';
import { DisplayStateCorruptionToastService } from '../../errors/services/display-state-corruption-toast.service';
import { mockLoggerService } from '../../../../tests/mock-logger-service';
import { mockDisplayStateCorruptionToastService } from '../../../../tests/mock-display-state-corruption-toast';

describe('LocalStorageUserService', () => {
  let service: LocalStorageUserService;

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
    service = TestBed.inject(LocalStorageUserService);
  });

  afterEach(() => {
    localStorage.removeItem('user');
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load user from localStorage on init', () => {
    const user = { name: 'John' };
    localStorage.setItem('user', JSON.stringify(user));

    expect(service.user).toEqual(user);
  });

  it('should return default user if localStorage is empty', () => {
    expect(service.user).toEqual({ name: '' });
  });

  it('should handle invalid json data', () => {
    localStorage.setItem('user', 'invalid-data');

    expect(service.user).toEqual({ name: '' });
    expect(mockLoggerService.error).toHaveBeenCalledWith(
      'Invalid user data : Unexpected token \'i\', "invalid-data" is not valid JSON, raw data: "invalid-data"',
    );
  });

  it('should handle invalid user data', () => {
    localStorage.setItem('user', JSON.stringify({ invalid: 'data' }));

    expect(service.user).toEqual({ name: '' });
    expect(mockLoggerService.error).toHaveBeenCalledWith(
      'Invalid user data structure: Validation error: Required at "name"',
    );
  });

  it('should not clear localStorage when state is invalid', () => {
    localStorage.setItem('user', JSON.stringify({ invalid: 'data' }));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unusedValue = service.user;
    service.user = { name: 'John' };

    expect(localStorage.getItem('user')).toEqual(
      JSON.stringify({ invalid: 'data' }),
    );
  });

  it('should show error toast', () => {
    localStorage.setItem('user', JSON.stringify({ invalid: 'data' }));

    expect(service.user).toEqual({ name: '' });
    expect(mockDisplayStateCorruptionToastService.show).toHaveBeenCalledWith(
      'User',
    );
  });

  it('should set user to localStorage', () => {
    service.user = { name: 'John' };

    expect(localStorage.getItem('user')).toEqual(
      JSON.stringify({ name: 'John' }),
    );
  });

  it('should not save localStorage if it was invalid before setting new user', () => {
    localStorage.setItem('user', JSON.stringify({ invalid: 'data' }));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unusedValue = service.user;

    service.user = { name: 'John' };

    expect(localStorage.getItem('user')).toEqual(
      JSON.stringify({ invalid: 'data' }),
    );
  });
});
