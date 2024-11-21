import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCalendarComponent } from './dashboard-calendar.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardCalendarService } from '../../services/dashboard-calendar.service';
import { CalendarComponent } from '../../../../ui/components/calendar/calendar.component';
import { By } from '@angular/platform-browser';
import { SessionStore } from '../../../../core/sessions/store/sessions.store';
import { generateSession } from '../../../../../tests/test-object-generators';

describe('DashboardCalendarComponent', () => {
  let component: DashboardCalendarComponent;
  let fixture: ComponentFixture<DashboardCalendarComponent>;
  let dashboardCalendarService: DashboardCalendarService;
  let sessionStore: InstanceType<typeof SessionStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCalendarComponent, NoopAnimationsModule],
      providers: [DashboardCalendarService, SessionStore],
    }).compileComponents();

    dashboardCalendarService = TestBed.inject(DashboardCalendarService);
    sessionStore = TestBed.inject(SessionStore);

    fixture = TestBed.createComponent(DashboardCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render calendar', () => {
    const calendar = fixture.debugElement.query(
      By.directive(CalendarComponent),
    );
    expect(calendar).toBeTruthy();
  });

  it('should set selected month on monthChanged event', () => {
    sessionStore.setSessions([
      generateSession({ date: new Date(2024, 11, 5) }),
      generateSession({ date: new Date(2024, 1, 2) }),
    ]);

    const calendar = fixture.debugElement.query(
      By.directive(CalendarComponent),
    );

    calendar.triggerEventHandler('monthChanged', {
      month: 12,
      year: 2024,
    });

    expect(dashboardCalendarService.selectedMonthSessions()).toEqual([
      sessionStore.sessions()[0],
    ]);
  });

  it('should render calendar with sessions for selected month', () => {
    sessionStore.setSessions([
      generateSession({ date: new Date(2024, 11, 5) }),
    ]);

    dashboardCalendarService.setSelectedMonth({
      month: 12,
      year: 2024,
    });

    fixture.detectChanges();

    const calendar = fixture.debugElement.query(
      By.directive(CalendarComponent),
    );

    expect(calendar.componentInstance.dates()).toEqual([
      sessionStore.sessions()[0].date,
    ]);
  });
});
