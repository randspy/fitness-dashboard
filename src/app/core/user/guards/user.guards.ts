import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserStore } from '../store/user.store';
import { DefaultRoute, WelcomeRoute } from '../../shared/domain/routes.config';

export const userSetupCompletedGuard = () => {
  const userExists = inject(UserStore).name();
  if (!userExists) {
    return inject(Router).navigate([WelcomeRoute]);
  }
  return true;
};

export const userSetupRequiredGuard = () => {
  const userExists = inject(UserStore).name();
  if (userExists) {
    return inject(Router).navigate([DefaultRoute]);
  }
  return true;
};
