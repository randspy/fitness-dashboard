import { Injectable, inject } from '@angular/core';
import { LoggerService } from '../../errors/services/logger.service';
import { DisplayStateCorruptionToastService } from '../../errors/services/display-state-corruption-toast.service';
import { Session } from '../domain/session.types';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { SessionSchema } from '../domain/session.schema';
import { sessionsLocalStorageKey } from '../../shared/domain/local-storage.config';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageSessionService {
  private loggerService = inject(LoggerService);
  private displayStateCorruptionToastService = inject(
    DisplayStateCorruptionToastService,
  );

  private stateIsValidated = true;

  get sessions(): Session[] {
    const sessionList = localStorage.getItem(sessionsLocalStorageKey);
    if (sessionList) {
      try {
        const rawSessions = JSON.parse(sessionList);
        const validatedSessions = z.array(SessionSchema).parse(rawSessions);
        const parsedSessions = validatedSessions.map((session) => ({
          ...session,
          date: new Date(session.date),
        }));

        return parsedSessions;
      } catch (error) {
        this.stateIsValidated = false;
        this.displayStateCorruptionToastService.show('Sessions');

        if (error instanceof SyntaxError) {
          this.loggerService.error(
            `Invalid session data : ${error.message}, raw data: "${sessionList}"`,
          );
        } else if (error instanceof z.ZodError) {
          this.loggerService.error(
            `Invalid session data structure: ${fromError(error).toString()}`,
          );
        }
      }
    }

    return [];
  }

  set sessions(sessionList: Session[]) {
    if (this.stateIsValidated) {
      localStorage.setItem(
        sessionsLocalStorageKey,
        JSON.stringify(sessionList),
      );
    }
  }
}
