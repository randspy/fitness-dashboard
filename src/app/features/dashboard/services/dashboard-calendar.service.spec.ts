import { TestBed } from '@angular/core/testing';

import { DashboardCalendarService } from './dashboard-calendar.service';
import { SessionStore } from '../../../core/sessions/store/sessions.store';
import { generateSession } from '../../../../../setup-jest';

describe('DashboardCalendarService', () => {
  let service: DashboardCalendarService;
  let sessionStore: InstanceType<typeof SessionStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardCalendarService],
    });
    sessionStore = TestBed.inject(SessionStore);
    service = TestBed.inject(DashboardCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should filter sessions for selected month', () => {
    const sessions = [
      generateSession({ date: new Date(2023, 10, 3) }),
      generateSession({ date: new Date(2024, 3, 1) }),
      generateSession({ date: new Date(2024, 10, 5) }),
    ];

    sessionStore.setSessions(sessions);
    service.setSelectedMonth({ month: 11, year: 2024 });

    expect(service.selectedMonthSessions()).toEqual([sessions[2]]);
  });

  it('should get all sessions dates', () => {
    const sessions = [
      generateSession({ date: new Date(2023, 10, 3) }),
      generateSession({ date: new Date(2024, 3, 1) }),
      generateSession({ date: new Date(2024, 10, 5) }),
    ];

    sessionStore.setSessions(sessions);
    service.setSelectedMonth({ month: 11, year: 2024 });

    expect(service.sessionsDates()).toEqual([
      sessions[2].date,
      sessions[0].date,
      sessions[1].date,
    ]);
  });
});
