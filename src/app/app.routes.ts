import { Routes } from '@angular/router';
import {
  userSetupCompletedGuard,
  userSetupRequiredGuard,
} from './core/user/user.guards';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'app/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('./features/landing/components/welcome/welcome.component').then(
        (m) => m.WelcomeComponent,
      ),
    canMatch: [userSetupRequiredGuard],
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./layout/components/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent,
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './features/dashboard/components/dashboard-page/dashboard-page.component'
          ).then((m) => m.DashboardPageComponent),
        canMatch: [userSetupCompletedGuard],
      },
      {
        path: 'exercises',
        loadComponent: () =>
          import(
            './features/exercises/components/exercise-page/exercise-page.component'
          ).then((m) => m.ExercisePageComponent),
      },
    ],
  },
  {
    path: 'page-not-found',
    loadComponent: () =>
      import(
        './layout/components/page-not-found-page/page-not-found-page.component'
      ).then((m) => m.PageNotFoundPageComponent),
  },
  { path: '**', redirectTo: 'page-not-found' },
];
