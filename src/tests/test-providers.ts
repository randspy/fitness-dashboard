import { Provider } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LOGGER_TRANSPORTER } from '../app/core/errors/domain/logger.types';

export function provideTestServices(): Provider[] {
  return [
    {
      provide: MessageService,
      useValue: {
        add: jest.fn(),
      },
    },
    {
      provide: LOGGER_TRANSPORTER,
      useValue: {
        log: jest.fn(),
      },
    },
  ];
}
