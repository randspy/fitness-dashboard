import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardCalendarComponent } from '../../components/dashboard-calendar/dashboard-calendar.component';
import { SessionListComponent } from '../../../../core/sessions/components/session-list/session-list.component';
import { DashboardCalendarService } from '../../services/dashboard-calendar.service';
import { PageSkeletonComponent } from '../../../../ui/components/page-skeleton/page-skeleton.component';
import { UserStore } from '../../../../core/user/user.store';

@Component({
  selector: 'fit-dashboard-page',
  standalone: true,
  imports: [
    DashboardCalendarComponent,
    SessionListComponent,
    PageSkeletonComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        @apply flex flex-grow flex-col;
      }
    `,
  ],
})
export class DashboardPageComponent {
  dashboardCalendarService = inject(DashboardCalendarService);
  userStore = inject(UserStore);
}
