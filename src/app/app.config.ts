import { ApplicationConfig, ErrorHandler, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient } from '@angular/common/http';
import { GlobalErrorHandler } from './core/errors/handlers/global-error.handler';
import { provideLogger } from './core/errors/domain/logger.config';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { themeConfig } from './app.styles';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideStore(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideHttpClient(),
    provideLogger(),
    providePrimeNG({ theme: themeConfig }),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    MessageService,
    ConfirmationService,
  ],
};
