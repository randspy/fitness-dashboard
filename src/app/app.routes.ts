import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';

// TODO: Implement a proper identity guard
const userExistsGuard = () => {
  const userExists = localStorage.getItem('user') !== null;
  if (!userExists) {
    return inject(Router).navigate(['/welcome']);
  }
  return true;
};

// TODO: Implement a proper identity guard
const userNotExistsGuard = () => {
  const userExists = localStorage.getItem('user') !== null;
  if (userExists) {
    return inject(Router).navigate(['/dashboard']);
  }
  return true;
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('./features/landing/components/welcome/welcome.component').then(
        (m) => m.WelcomeComponent,
      ),
    canMatch: [userNotExistsGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import(
        './features/dashboard/components/dashboard-page/dashboard-page.component'
      ).then((m) => m.DashboardPageComponent),
    canMatch: [userExistsGuard],
  },
  {
    path: 'page-not-found',
    loadComponent: () =>
      import(
        './features/page-not-found/components/page-not-found-page/page-not-found-page.component'
      ).then((m) => m.PageNotFoundPageComponent),
  },
  { path: '**', redirectTo: 'page-not-found' },
];
