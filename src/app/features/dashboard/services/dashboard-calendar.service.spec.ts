import { TestBed } from '@angular/core/testing';

import { DashboardCalendarService } from './dashboard-calendar.service';
import { SessionStore } from '../../../core/sessions/store/sessions.store';
import { generateSession } from '../../../../tests/test-object-generators';
import { provideTestServices } from '../../../../tests/test-providers';

describe('DashboardCalendarService', () => {
  let service: DashboardCalendarService;
  let sessionStore: InstanceType<typeof SessionStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardCalendarService, ...provideTestServices()],
    });
    sessionStore = TestBed.inject(SessionStore);
    service = TestBed.inject(DashboardCalendarService);
  });

  afterEach(() => {
    sessionStore.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should filter sessions for selected month', () => {
    const sessions = [
      generateSession({ id: '1', date: new Date(2023, 10, 3) }),
      generateSession({ id: '2', date: new Date(2024, 3, 1) }),
      generateSession({ id: '3', date: new Date(2024, 10, 5) }),
    ];

    sessionStore.setSessions(sessions);
    service.setSelectedMonth({ month: 11, year: 2024 });

    expect(service.selectedMonthSessions()).toEqual([sessions[2]]);
  });

  it('should get specific month sessions dates', () => {
    const sessions = [
      generateSession({ id: '1', date: new Date(2023, 10, 3) }),
      generateSession({ id: '2', date: new Date(2024, 3, 1) }),
      generateSession({ id: '3', date: new Date(2024, 10, 5) }),
    ];

    sessionStore.setSessions(sessions);
    service.setSelectedMonth({ month: 11, year: 2024 });

    expect(service.sessionsDates()).toEqual([sessions[2].date]);
  });

  it('should return selected month date', () => {
    service.setSelectedMonth({ month: 11, year: 2024 });
    expect(service.selectedMonthDate()).toEqual(new Date(2024, 10, 1));
  });
});
