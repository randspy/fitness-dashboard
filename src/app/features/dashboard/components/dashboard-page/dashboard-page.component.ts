import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fit-dashboard-page',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {}
