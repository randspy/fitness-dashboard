import { Route } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { userSetupRequiredGuard } from '../../core/user/guards/user.guards';

export const landingRoutes: Route[] = [
  {
    path: 'welcome',
    title: 'Welcome',
    component: WelcomeComponent,
    canMatch: [userSetupRequiredGuard],
  },
];
