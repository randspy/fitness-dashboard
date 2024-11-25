import { makeEnvironmentProviders } from '@angular/core';
import {
  CapturedPayload,
  ITransporter,
  LOGGER_TRANSPORTER,
} from './logger.model';
import { ConsoleTransporter } from './transporters/console-transporter';
import { LoggerService } from './services/logger.service';

export const provideLogger = () => {
  return makeEnvironmentProviders([
    {
      provide: LOGGER_TRANSPORTER,
      useClass: ConsoleTransporter,
    },
    LoggerService,
  ]);
};

export const provideTestLogger = (
  mockTransporter: ITransporter<CapturedPayload>,
) => {
  return makeEnvironmentProviders([
    {
      provide: LOGGER_TRANSPORTER,
      useValue: mockTransporter,
    },
    LoggerService,
  ]);
};
