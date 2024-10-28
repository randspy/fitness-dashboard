import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserStore } from './user.store';

export const userSetupCompletedGuard = () => {
  const userExists = inject(UserStore).name();
  if (!userExists) {
    return inject(Router).navigate(['/welcome']);
  }
  return true;
};

export const userSetupRequiredGuard = () => {
  const userExists = inject(UserStore).name();
  if (userExists) {
    return inject(Router).navigate(['/app/dashboard']);
  }
  return true;
};
