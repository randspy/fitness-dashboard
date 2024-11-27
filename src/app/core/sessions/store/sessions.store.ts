import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, effect } from '@angular/core';
import { Session } from '../domain/session.types';
import {
  addEntity,
  removeAllEntities,
  removeEntity,
  setEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';

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
  withHooks((store) => ({
    onInit() {
      const sessions = localStorage.getItem('sessions');

      if (sessions) {
        const parsedSessions = JSON.parse(sessions).map((session: Session) => ({
          ...session,
          date: new Date(session.date),
        }));

        updateState(store, 'init', setEntities(parsedSessions));
      }

      effect(() => {
        localStorage.setItem('sessions', JSON.stringify(store.sessions()));
      });
    },
  })),
);
