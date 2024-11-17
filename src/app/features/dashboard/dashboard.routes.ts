import { Routes } from '@angular/router';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { DashboardCalendarService } from './services/dashboard-calendar.service';
import { MotivationQuoteService } from './services/motivation-quote.service';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    providers: [DashboardCalendarService, MotivationQuoteService],
  },
];
