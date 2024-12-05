import { signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { effect, inject } from '@angular/core';
import { User } from '../domain/user.types';
import { LocalStorageUserService } from '../services/local-storage-user.service';

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
    reset() {
      updateState(store, 'reset', () => initialState);
    },
  })),
  withHooks((store) => {
    const localStorageUserService = inject(LocalStorageUserService);

    return {
      onInit() {
        const user = localStorageUserService.user;
        store.setName(user.name);

        effect(() => {
          localStorageUserService.user = {
            name: store.name(),
          };
        });
      },
    };
  }),
);
