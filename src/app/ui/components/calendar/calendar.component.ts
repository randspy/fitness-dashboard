import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DatePickerModule,
  DatePickerMonthChangeEvent,
} from 'primeng/datepicker';

@Component({
  selector: 'fit-calendar',
  standalone: true,
  imports: [DatePickerModule, FormsModule],
  templateUrl: './calendar.component.html',
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
export class CalendarComponent {
  dates = input.required<Date[]>();
  monthChanged = output<DatePickerMonthChangeEvent>();

  onMonthChange(event: DatePickerMonthChangeEvent) {
    this.monthChanged.emit(event);
  }
}
