import { Routes } from '@angular/router';
import {
  userSetupCompletedGuard,
  userSetupRequiredGuard,
} from './core/user/user.guards';
import { MainLayoutComponent } from './layout/components/main-layout/main-layout.component';

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
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './features/dashboard/components/dashboard-page/dashboard-page.component'
          ).then((m) => m.DashboardPageComponent),
        canMatch: [userSetupCompletedGuard],
      },
    ],
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
