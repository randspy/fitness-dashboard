import { makeEnvironmentProviders } from '@angular/core';
import { LOGGER_TRANSPORTER } from './logger.model';
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
