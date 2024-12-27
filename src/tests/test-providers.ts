import { Provider } from '@angular/core';
import { Confirmation, MessageService } from 'primeng/api';
import { LOGGER_TRANSPORTER } from '../app/core/errors/domain/logger.types';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';

export function provideTestServices(): Provider[] {
  return [
    {
      provide: ConfirmationService,
      useValue: {
        confirm: jest.fn(),
        requireConfirmation$: new Subject<Confirmation>(),
      },
    },
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
