import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { effect } from '@angular/core';
import { Session } from '../domain/session.types';

interface SessionsState {
  sessions: Session[];
}

export const initialState: SessionsState = {
  sessions: [],
};

export const SessionStore = signalStore(
  { providedIn: 'root' },
  withDevtools('sessions'),
  withState(initialState),
  withMethods((store) => ({
    getSessionById(id: string) {
      return store.sessions().find((session) => session.id === id);
    },
    addSession(session: Session) {
      updateState(store, 'addSession', (state) => ({
        ...state,
        sessions: [...state.sessions, { ...session }],
      }));
    },
    removeSession(id: string) {
      updateState(store, 'removeSession', (state) => ({
        ...state,
        sessions: state.sessions.filter((session) => session.id !== id),
      }));
    },
    updateSession(id: string, session: Session) {
      updateState(store, 'updateSession', (state) => ({
        ...state,
        sessions: state.sessions.map((s) =>
          s.id === id ? { ...s, ...session } : s,
        ),
      }));
    },
    setSessions(sessions: Session[]) {
      updateState(store, 'setSessions', (state) => ({
        ...state,
        sessions: [...sessions],
      }));
    },
    reset() {
      patchState(store, initialState);
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

        updateState(store, 'init', () => ({
          sessions: parsedSessions,
        }));
      }

      effect(() => {
        localStorage.setItem('sessions', JSON.stringify(store.sessions()));
      });
    },
  })),
);
