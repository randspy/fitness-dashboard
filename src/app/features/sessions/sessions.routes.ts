import { Routes } from '@angular/router';
import { SessionPageComponent } from './components/session-page/session-page.component';
import { NewSessionPageComponent } from './components/new-session-page/new-session-page.component';
export const sessionsRoutes: Routes = [
  {
    path: '',
    component: SessionPageComponent,
  },
  {
    path: 'new',
    component: NewSessionPageComponent,
  },
];
