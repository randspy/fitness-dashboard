import { inject, Injectable } from '@angular/core';
import {
  Session,
  SessionExercise,
} from '../../../core/sessions/domain/session.types';
import { SessionStore } from '../../../core/sessions/store/sessions.store';
import { ExerciseStore } from '../../../core/exercises/store/exercise.store';

@Injectable()
export class SessionStoreService {
  sessionStore = inject(SessionStore);
  exerciseStore = inject(ExerciseStore);

  addSession(session: Session) {
    this.sessionStore.addSession(session);

    this.addSessionToExerciseUsage(session.exercises, session.id);
  }

  updateSession(id: string, session: Session) {
    const sessionFromStore = this.sessionStore
      .sessions()
      .find((s) => s.id === id);

    if (sessionFromStore) {
      const exercisesToAdd = this.findExerciseToAdd(session, sessionFromStore);
      this.addSessionToExerciseUsage(exercisesToAdd, id);

      const exercisesToRemove = this.findExerciseToRemove(
        session,
        sessionFromStore,
      );
      this.removeSessionFromExerciseUsage(exercisesToRemove, id);

      this.sessionStore.updateSession(id, session);
    }
  }

  private findExerciseToAdd(session: Session, sessionFromStore: Session) {
    const sessionExercisesIdsFromStore = new Set(
      sessionFromStore.exercises.map((e) => e.exerciseId),
    );

    return session.exercises.filter(
      (e) => !sessionExercisesIdsFromStore.has(e.exerciseId),
    );
  }

  private findExerciseToRemove(session: Session, sessionFromStore: Session) {
    const sessionExercisesIdsFromInput = new Set(
      session.exercises.map((e) => e.exerciseId),
    );

    return sessionFromStore.exercises.filter(
      (e) => !sessionExercisesIdsFromInput.has(e.exerciseId),
    );
  }

  private addSessionToExerciseUsage(
    exercisesToAdd: SessionExercise[],
    sessionId: string,
  ) {
    for (const sessionExercise of exercisesToAdd) {
      const exercise = this.exerciseStore
        .exercises()
        .find((e) => e.id === sessionExercise.exerciseId);

      if (exercise) {
        this.exerciseStore.updateExercise(sessionExercise.exerciseId, {
          ...exercise,
          usage: [...exercise.usage, { id: sessionId }],
        });
      }
    }
  }

  private removeSessionFromExerciseUsage(
    exercisesToRemove: SessionExercise[],
    sessionId: string,
  ) {
    for (const sessionExercise of exercisesToRemove) {
      const exercise = this.exerciseStore
        .exercises()
        .find((e) => e.id === sessionExercise.exerciseId);

      if (exercise) {
        const usage = exercise.usage.filter((u) => u.id !== sessionId);
        if (!usage.length && exercise.hidden) {
          this.exerciseStore.removeExercise(sessionExercise.exerciseId);
        } else {
          this.exerciseStore.updateExercise(sessionExercise.exerciseId, {
            ...exercise,
            usage,
          });
        }
      }
    }
  }

  removeSession(id: string) {
    const sessionFromStore = this.sessionStore.getSessionById(id);

    if (sessionFromStore) {
      this.removeSessionFromExerciseUsage(sessionFromStore.exercises, id);
      this.sessionStore.removeSession(id);
    }
  }
}
