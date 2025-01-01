import { Routes } from '@angular/router';
import { userSetupCompletedGuard } from './core/user/guards/user.guards';
import { DefaultRoute } from './core/shared/domain/routes.config';

export const routes: Routes = [
  {
    path: '',
    redirectTo: DefaultRoute,
    pathMatch: 'full',
  },
  {
    path: 'landing',
    loadChildren: () =>
      import('./features/landing/landing.routes').then((m) => m.landingRoutes),
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./layout/components/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent,
      ),
    canMatch: [userSetupCompletedGuard],
    children: [
      { path: '', redirectTo: DefaultRoute, pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(
            (m) => m.dashboardRoutes,
          ),
      },
      {
        path: 'exercises',
        loadChildren: () =>
          import('./features/exercises/exercises.routes').then(
            (m) => m.exercisesRoutes,
          ),
      },
      {
        path: 'sessions',
        loadChildren: () =>
          import('./features/sessions/sessions.routes').then(
            (m) => m.sessionsRoutes,
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.router').then(
            (m) => m.settingsRoutes,
          ),
      },
    ],
  },
  {
    path: 'page-not-found',
    title: 'Page Not Found',
    loadComponent: () =>
      import(
        './layout/components/page-not-found-page/page-not-found-page.component'
      ).then((m) => m.PageNotFoundPageComponent),
  },
  { path: '**', redirectTo: 'page-not-found' },
];
