import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPageComponent } from './dashboard-page.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DashboardCalendarComponent } from '../dashboard-calendar/dashboard-calendar.component';
import { DashboardCalendarService } from '../../services/dashboard-calendar.service';
import { SessionListComponent } from '../../../../core/sessions/components/session-list/session-list.component';
import { SessionStore } from '../../../../core/sessions/store/sessions.store';
import { generateSession } from '../../../../../../setup-jest';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let sessionStore: InstanceType<typeof SessionStore>;
  let dashboardCalendarService: DashboardCalendarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent, NoopAnimationsModule],
      providers: [DashboardCalendarService],
    }).compileComponents();

    sessionStore = TestBed.inject(SessionStore);
    dashboardCalendarService = TestBed.inject(DashboardCalendarService);
    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render calendar', () => {
    const calendar = fixture.debugElement.query(
      By.directive(DashboardCalendarComponent),
    );
    expect(calendar).toBeTruthy();
  });

  it('should render session list', () => {
    const sessionList = fixture.debugElement.query(
      By.directive(SessionListComponent),
    );
    expect(sessionList).toBeTruthy();
  });

  it('should render session list with sessions from selected month', () => {
    sessionStore.setSessions([
      generateSession({ date: new Date(2024, 11, 5) }),
      generateSession({ date: new Date(2024, 1, 2) }),
    ]);

    dashboardCalendarService.setSelectedMonth({
      month: 12,
      year: 2024,
    });

    const sessionList = fixture.debugElement.query(
      By.directive(SessionListComponent),
    );

    fixture.detectChanges();

    expect(sessionList).toBeTruthy();
    expect(sessionList.componentInstance.sessions()).toEqual([
      sessionStore.sessions()[0],
    ]);
  });
});
