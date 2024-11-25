import { Injectable, inject } from '@angular/core';
import {
  CapturedPayload,
  LogLevel,
  LogTypes,
  LOGGER_TRANSPORTER,
  ILoggerService,
} from '../logger.model';

@Injectable({
  providedIn: 'root',
})
export class LoggerService implements ILoggerService {
  private transporter = inject(LOGGER_TRANSPORTER);

  info(message: LogTypes): void {
    this.logWith('INFO', message);
  }

  debug(message: LogTypes): void {
    this.logWith('DEBUG', message);
  }

  warn(message: LogTypes): void {
    this.logWith('WARN', message);
  }

  error(error: LogTypes): void {
    this.logWith('ERROR', error);
  }

  private logWith(logLevel: LogLevel, payload: LogTypes) {
    const capturedPayload: CapturedPayload = {
      payload,
      level: logLevel,
      timestamp: new Date(),
    };

    this.transporter.log(capturedPayload, logLevel);
  }
}
