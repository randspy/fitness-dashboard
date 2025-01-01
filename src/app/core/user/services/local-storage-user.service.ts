import { inject, Injectable } from '@angular/core';
import { LoggerService } from '../../errors/services/logger.service';
import { DisplayStateCorruptionToastService } from '../../errors/services/display-state-corruption-toast.service';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { UserSchema } from '../domain/user.schema';
import { User } from '../domain/user.types';
import { userLocalStorageKey } from '../../shared/domain/local-storage.config';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageUserService {
  private loggerService = inject(LoggerService);
  private displayStateCorruptionToastService = inject(
    DisplayStateCorruptionToastService,
  );

  private stateIsValidated = true;

  get user(): User {
    const username = localStorage.getItem(userLocalStorageKey);
    try {
      if (username) {
        const parsedUsername = JSON.parse(username);
        const validatedUsername = UserSchema.parse(parsedUsername);

        return validatedUsername;
      }
    } catch (error) {
      this.stateIsValidated = false;
      this.displayStateCorruptionToastService.show('User');

      if (error instanceof SyntaxError) {
        this.loggerService.error(
          `Invalid user data : ${error.message}, raw data: "${username}"`,
        );
      } else if (error instanceof z.ZodError) {
        this.loggerService.error(
          `Invalid user data structure: ${fromError(error).toString()}`,
        );
      }
    }

    return {
      name: '',
    };
  }

  set user(user: User) {
    if (this.stateIsValidated) {
      localStorage.setItem(userLocalStorageKey, JSON.stringify(user));
    }
  }
}
