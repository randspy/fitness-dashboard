import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject } from '@angular/core';
import { Session } from '../domain/session.types';
import {
  addEntity,
  removeAllEntities,
  removeEntity,
  setEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { SessionSchema } from '../domain/session.schema';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { LoggerService } from '../../errors/services/logger.service';

export const SessionStore = signalStore(
  { providedIn: 'root' },
  withDevtools('sessions'),
  withEntities<Session>(),
  withComputed(({ entities }) => ({
    sessions: computed(() => entities()),
  })),
  withMethods((store) => ({
    getSessionById: (id: string) => store.entityMap()[id],
    addSession(session: Session) {
      updateState(store, 'addSession', addEntity(session));
    },
    removeSession(id: string) {
      updateState(store, 'removeSession', removeEntity(id));
    },
    updateSession(id: string, session: Session) {
      updateState(
        store,
        'updateSession',
        updateEntity({ id, changes: session }),
      );
    },
    setSessions(sessions: Session[]) {
      updateState(store, 'setSessions', setEntities(sessions));
    },
    reset() {
      updateState(store, 'reset', removeAllEntities());
    },
  })),
  withHooks((store) => {
    const loggerService = inject(LoggerService);
    let stateIsValidated = true;

    return {
      onInit() {
        const sessions = localStorage.getItem('sessions');

        if (sessions) {
          try {
            const rawSessions = JSON.parse(sessions);
            const validatedSessions = z.array(SessionSchema).parse(rawSessions);
            const parsedSessions = validatedSessions.map((session) => ({
              ...session,
              date: new Date(session.date),
            }));

            updateState(store, 'init', setEntities(parsedSessions));
          } catch (error) {
            stateIsValidated = false;

            if (error instanceof SyntaxError) {
              loggerService.error(
                `Invalid session data : ${error.message}, raw data: "${sessions}"`,
              );
            } else if (error instanceof z.ZodError) {
              loggerService.error(
                `Invalid session data structure: ${fromError(error).toString()}`,
              );
            }
          }
        }

        effect(() => {
          if (stateIsValidated) {
            localStorage.setItem('sessions', JSON.stringify(store.sessions()));
          }
        });
      },
    };
  }),
);
