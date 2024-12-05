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
import { LocalStorageSessionService } from '../services/local-storage-session.service';

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
    const localStorageSessionService = inject(LocalStorageSessionService);

    return {
      onInit() {
        updateState(
          store,
          'init',
          setEntities(localStorageSessionService.sessions),
        );

        effect(() => {
          localStorageSessionService.sessions = store.sessions();
        });
      },
    };
  }),
);
