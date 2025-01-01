import { computed, inject, Injectable, signal } from '@angular/core';
import { SessionStore } from '../../../core/sessions/store/sessions.store';
import { Session } from '../../../core/sessions/domain/session.types';
import { SelectedMonth } from '../../../ui/components/calendar/calendar.component';
@Injectable()
export class DashboardCalendarService {
  private sessionStore = inject(SessionStore);
  private selectedMonth = signal<SelectedMonth>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  sessionsDates = computed(() => {
    const thisMonthSessions = this.sessionStore
      .sessions()
      .filter((session) => this.isSelectedMonth(session, this.selectedMonth()));

    return thisMonthSessions.map((session) => session.date);
  });

  selectedMonthSessions = computed(() => {
    return this.sessionStore
      .sessions()
      .filter((session) => this.isSelectedMonth(session, this.selectedMonth()));
  });

  setSelectedMonth(event: SelectedMonth) {
    this.selectedMonth.set(event);
  }

  selectedMonthDate = computed(() => {
    return new Date(
      this.selectedMonth().year,
      this.selectedMonth().month - 1,
      1,
    );
  });

  private isSelectedMonth(session: Session, selectedMonth: SelectedMonth) {
    return (
      session.date.getMonth() + 1 === selectedMonth.month &&
      session.date.getFullYear() === selectedMonth.year
    );
  }
}
