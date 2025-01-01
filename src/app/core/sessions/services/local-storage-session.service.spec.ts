import { TestBed } from '@angular/core/testing';

import { LocalStorageSessionService } from './local-storage-session.service';
import { DisplayStateCorruptionToastService } from '../../errors/services/display-state-corruption-toast.service';
import { LoggerService } from '../../errors/services/logger.service';
import { mockLoggerService } from '../../../../tests/mock-logger-service';
import { mockDisplayStateCorruptionToastService } from '../../../../tests/mock-display-state-corruption-toast';
import { generateSession } from '../../../../tests/test-object-generators';
import { sessionsLocalStorageKey } from '../../shared/domain/local-storage.config';

describe('LocalStorageSessionService', () => {
  let service: LocalStorageSessionService;

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
    service = TestBed.inject(LocalStorageSessionService);
  });

  afterEach(() => {
    localStorage.removeItem('sessions');
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get sessions from localStorage', () => {
    const sessions = [generateSession({ id: '1' })];
    localStorage.setItem(sessionsLocalStorageKey, JSON.stringify(sessions));

    expect(service.sessions).toEqual(sessions);
  });

  it('should return an empty array if no sessions are found in localStorage', () => {
    expect(service.sessions).toEqual([]);
  });

  it('should handle invalid json data', () => {
    localStorage.setItem(sessionsLocalStorageKey, 'invalid-data');

    expect(service.sessions).toEqual([]);
    expect(mockLoggerService.error).toHaveBeenCalledWith(
      'Invalid session data : Unexpected token \'i\', "invalid-data" is not valid JSON, raw data: "invalid-data"',
    );
  });

  it('should handle invalid session data structure', () => {
    localStorage.setItem(
      sessionsLocalStorageKey,
      JSON.stringify([{ invalid: 'data' }]),
    );

    expect(service.sessions).toEqual([]);
    expect(mockLoggerService.error).toHaveBeenCalledWith(
      'Invalid session data structure: Validation error: Required at "[0].id"; Required at "[0].name"; Required at "[0].date"; Required at "[0].exercises"',
    );
  });

  it('should show error toast', () => {
    localStorage.setItem(
      sessionsLocalStorageKey,
      JSON.stringify([{ invalid: 'data' }]),
    );

    expect(service.sessions).toEqual([]);
    expect(mockDisplayStateCorruptionToastService.show).toHaveBeenCalledWith(
      'Sessions',
    );
  });

  it('should set sessions to localStorage', () => {
    const sessions = [generateSession({ id: '1' })];
    service.sessions = sessions;

    expect(localStorage.getItem(sessionsLocalStorageKey)).toEqual(
      JSON.stringify(sessions),
    );
  });

  it('should not save localStorage if it was invalid before setting new sessions', () => {
    localStorage.setItem(
      sessionsLocalStorageKey,
      JSON.stringify([{ invalid: 'data' }]),
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unusedValue = service.sessions;

    service.sessions = [generateSession({ id: '1' })];

    expect(localStorage.getItem(sessionsLocalStorageKey)).toEqual(
      JSON.stringify([{ invalid: 'data' }]),
    );
  });
});
