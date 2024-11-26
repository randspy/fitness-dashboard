import { computed, inject, Injectable, signal, untracked } from '@angular/core';
import { DatePickerMonthChangeEvent } from 'primeng/datepicker';
import { SessionStore } from '../../../core/sessions/store/sessions.store';
import { Session } from '../../../core/sessions/domain/session.types';

@Injectable()
export class DashboardCalendarService {
  private sessionStore = inject(SessionStore);
  private selectedMonth = signal<DatePickerMonthChangeEvent>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  sessionsDates = computed(() => {
    // that convoluted code comes from weird behavior of primeng datepicker
    // when loaded it always starts on the month of the first date
    // so the date of current month need to be first
    // normally we would just filter the dates for a given month
    // but replacing the dates in the input is causing the datepicker weird behavior
    // specifically the selected month view is not updated while moving
    // between months if the given month is empty.
    // I have strong suspicions that this is a bug in primeng

    const selectedMonth = untracked(() => this.selectedMonth());
    const thisMonthSessions = this.sessionStore
      .sessions()
      .filter((session) => this.isSelectedMonth(session, selectedMonth));

    const notThisMonthSessions = this.sessionStore
      .sessions()
      .filter((session) => !this.isSelectedMonth(session, selectedMonth));

    return [...thisMonthSessions, ...notThisMonthSessions].map(
      (session) => session.date,
    );
  });

  selectedMonthSessions = computed(() => {
    return this.sessionStore
      .sessions()
      .filter((session) => this.isSelectedMonth(session, this.selectedMonth()));
  });

  setSelectedMonth(event: DatePickerMonthChangeEvent) {
    this.selectedMonth.set(event);
  }

  private isSelectedMonth(
    session: Session,
    selectedMonth: DatePickerMonthChangeEvent,
  ) {
    return (
      session.date.getMonth() + 1 === selectedMonth.month &&
      session.date.getFullYear() === selectedMonth.year
    );
  }
}
