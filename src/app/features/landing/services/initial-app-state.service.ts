import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, pairwise } from 'rxjs';
import { WelcomeRoute } from '../../../core/shared/domain/routes.config';
import {
  exercisesLocalStorageKey,
  sessionsLocalStorageKey,
} from '../../../core/shared/domain/local-storage.config';
import { Exercise } from '../../../core/exercises/domain/exercise.types';
import { Session } from '../../../core/sessions/domain/session.types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class InitialAppStateService {
  private initialExercises: Exercise[] = [
    {
      id: 'exercise-1',
      name: 'Example Exercise',
      description: 'This is an example exercise',
      hidden: false,
      position: 0,
      usage: [{ id: 'session-1' }],
    },
  ];

  private initialSessions: Session[] = [
    {
      id: 'session-1',
      date: new Date(),
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
  ];

  constructor(private router: Router) {
    router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        pairwise(),
        filter(
          ([prev, curr]) =>
            prev.url === WelcomeRoute && curr.url !== WelcomeRoute,
        ),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        if (
          !localStorage.getItem(exercisesLocalStorageKey) &&
          !localStorage.getItem(sessionsLocalStorageKey)
        ) {
          localStorage.setItem(
            exercisesLocalStorageKey,
            JSON.stringify(this.initialExercises),
          );

          localStorage.setItem(
            sessionsLocalStorageKey,
            JSON.stringify(this.initialSessions),
          );
        }
      });
  }
}
