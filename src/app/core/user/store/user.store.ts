import { signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { effect, inject } from '@angular/core';
import { LoggerService } from '../../errors/services/logger.service';
import { fromError } from 'zod-validation-error';
import { z } from 'zod';
import { UserSchema } from '../domain/user.schema';

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
    reset() {
      updateState(store, 'reset', () => initialState);
    },
  })),
  withHooks((store) => {
    const loggerService = inject(LoggerService);
    let stateIsValidated = true;

    return {
      onInit() {
        const user = localStorage.getItem('user');
        try {
          if (user) {
            const parsedUser = JSON.parse(user);
            const validatedUser = UserSchema.parse(parsedUser);

            store.setName(validatedUser.name);
          }
        } catch (error) {
          stateIsValidated = false;

          if (error instanceof SyntaxError) {
            loggerService.error(
              `Invalid user data : ${error.message}, raw data: "${user}"`,
            );
          } else if (error instanceof z.ZodError) {
            loggerService.error(
              `Invalid user data structure: ${fromError(error).toString()}`,
            );
          }
        }

        effect(() => {
          if (stateIsValidated) {
            localStorage.setItem(
              'user',
              JSON.stringify({ name: store.name() }),
            );
          }
        });
      },
    };
  }),
);
