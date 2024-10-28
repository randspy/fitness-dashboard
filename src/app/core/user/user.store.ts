import { signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { effect } from '@angular/core';

interface User {
  name: string;
}

const initialState: User = {
  name: '',
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withDevtools('user'),
  withState(initialState),
  withMethods((store) => ({
    setName(name: string) {
      updateState(store, 'setName', (state) => ({ ...state, name }));
    },
  })),
  withHooks((store) => ({
    onInit() {
      const user = localStorage.getItem('user');
      if (user) {
        store.setName(JSON.parse(user).name);
      }

      effect(() => {
        localStorage.setItem('user', JSON.stringify({ name: store.name() }));
      });
    },
  })),
);
