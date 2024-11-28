import { makeEnvironmentProviders } from '@angular/core';
import {
  CapturedPayload,
  ITransporter,
  LOGGER_TRANSPORTER,
} from '../app/core/errors/domain/logger.types';
import { LoggerService } from '../app/core/errors/services/logger.service';

export const provideTestLogger = (
  mockTransporter: ITransporter<CapturedPayload> = {
    log: jest.fn(),
  } as jest.Mocked<ITransporter<CapturedPayload>>,
) => {
  return makeEnvironmentProviders([
    {
      provide: LOGGER_TRANSPORTER,
      useValue: mockTransporter,
    },
    LoggerService,
  ]);
};
