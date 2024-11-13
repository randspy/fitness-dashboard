import { Route } from '@angular/router';
import { inject } from '@angular/core';
import { Router, UrlSegment } from '@angular/router';
import { SessionStore } from '../../../core/sessions/store/sessions.store';

export const sessionExistsGuard = (route: Route, segments: UrlSegment[]) => {
  const router = inject(Router);
  const sessionStore = inject(SessionStore);

  const id = segments[0]?.path;
  if (sessionStore.getSessionById(id)) {
    return true;
  }

  return router.navigate(['/page-not-found']);
};
