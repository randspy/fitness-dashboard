import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { InitialAppStateService } from './initial-app-state.service';
import {
  DefaultRoute,
  WelcomeRoute,
} from '../../../core/shared/domain/routes.config';
import { NavigationEnd, Router } from '@angular/router';
import {
  exercisesLocalStorageKey,
  sessionsLocalStorageKey,
} from '../../../core/shared/domain/local-storage.config';
import { Subject } from 'rxjs/internal/Subject';

describe('InitialAppStateService', () => {
  let service: InitialAppStateService;
  let routerEvents: Subject<NavigationEnd>;
  const mockDate = new Date('2024-01-01T00:00:00.000Z');

  beforeEach(() => {
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    routerEvents = new Subject<NavigationEnd>();
    TestBed.configureTestingModule({
      providers: [
        InitialAppStateService,
        {
          provide: Router,
          useValue: { events: routerEvents.asObservable() },
        },
      ],
    });
    service = TestBed.inject(InitialAppStateService);
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not save initial local storage state when staying on welcome', fakeAsync(() => {
    routerEvents.next(new NavigationEnd(1, WelcomeRoute, WelcomeRoute));
    routerEvents.next(new NavigationEnd(2, WelcomeRoute, WelcomeRoute));

    tick();

    expect(localStorage.getItem(exercisesLocalStorageKey)).toBeNull();
    expect(localStorage.getItem(sessionsLocalStorageKey)).toBeNull();
  }));

  it('should not save initial local storage state when local storage is already populated', fakeAsync(() => {
    localStorage.setItem(exercisesLocalStorageKey, JSON.stringify([]));
    localStorage.setItem(sessionsLocalStorageKey, JSON.stringify([]));

    routerEvents.next(new NavigationEnd(1, WelcomeRoute, WelcomeRoute));
    routerEvents.next(new NavigationEnd(2, DefaultRoute, DefaultRoute));

    tick();

    expect(localStorage.getItem(exercisesLocalStorageKey)).toEqual(
      JSON.stringify([]),
    );

    expect(localStorage.getItem(sessionsLocalStorageKey)).toEqual(
      JSON.stringify([]),
    );
  }));

  it('should save initial local storage state when leaving welcome', fakeAsync(() => {
    routerEvents.next(new NavigationEnd(1, WelcomeRoute, WelcomeRoute));
    routerEvents.next(new NavigationEnd(2, DefaultRoute, DefaultRoute));

    tick();

    expect(localStorage.getItem(exercisesLocalStorageKey)).toEqual(
      JSON.stringify([
        {
          id: 'exercise-1',
          name: 'Example Exercise',
          description: 'This is an example exercise',
          hidden: false,
          position: 0,
          usage: [{ id: '1' }],
        },
      ]),
    );

    expect(localStorage.getItem(sessionsLocalStorageKey)).toEqual(
      JSON.stringify([
        {
          id: 'session-1',
          date: mockDate,
          name: 'Example Session',
          exercises: [
            {
              id: 'exercise-1',
              exerciseId: 'exercise-1',
              sets: [
                {
                  id: 'set-1',
                  repetitions: 10,
                  weight: 60,
                },
              ],
            },
          ],
        },
      ]),
    );
  }));
});
