import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DatePicker,
  DatePickerModule,
  DatePickerMonthChangeEvent,
} from 'primeng/datepicker';

export interface SelectedMonth {
  month: number;
  year: number;
}

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

      ::ng-deep .p-datepicker .p-datepicker-panel {
        border-radius: 12px;
      }
    `,
  ],
})
export class CalendarComponent {
  private datePicker = viewChild.required<DatePicker>('datepicker');

  dates = input.required<Date[]>();
  monthChanged = output<SelectedMonth>();
  currentMonthDate = input.required<Date>();

  private updateDatepicker = effect(() => {
    // for what ever reason, setting those through the template doesn't work
    // https://stackoverflow.com/questions/76510977/how-do-i-set-shown-month-when-using-primeng-calendar-with-multiple-selection
    this.datePicker().defaultDate = this.currentMonthDate();
    this.datePicker().updateModel(this.dates());
  });

  onMonthChange(event: DatePickerMonthChangeEvent) {
    if (event.month !== undefined && event.year !== undefined) {
      this.monthChanged.emit({
        month: event.month,
        year: event.year,
      });
    }
  }
}
