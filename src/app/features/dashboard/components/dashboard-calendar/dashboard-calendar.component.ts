import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardCalendarService } from '../../services/dashboard-calendar.service';
import { CalendarComponent } from '../../../../ui/components/calendar/calendar.component';

@Component({
  selector: 'fit-dashboard-calendar',
  standalone: true,
  imports: [CalendarComponent],
  templateUrl: './dashboard-calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      ::ng-deep .p-datepicker table td {
        &:not(.p-datepicker-other-month) {
          pointer-events: none;
        }
      }
    `,
  ],
})
export class DashboardCalendarComponent {
  dashboardCalendarService = inject(DashboardCalendarService);
}
