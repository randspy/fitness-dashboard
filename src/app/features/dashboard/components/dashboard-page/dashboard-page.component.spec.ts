import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPageComponent } from './dashboard-page.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DashboardCalendarComponent } from '../dashboard-calendar/dashboard-calendar.component';
import { DashboardCalendarService } from '../../services/dashboard-calendar.service';
import { SessionListComponent } from '../../../../core/sessions/components/session-list/session-list.component';
import { SessionStore } from '../../../../core/sessions/store/sessions.store';
import { generateSession } from '../../../../../../setup-jest';
import { UserStore } from '../../../../core/user/store/user.store';
import { MotivationQuoteService } from '../../services/motivation-quote.service';
import { provideHttpClient } from '@angular/common/http';
import { MotivationQuoteComponent } from '../motivation-quote/motivation-quote.component';
import { SessionStoreService } from '../../../../core/sessions/service/session-store.service';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let sessionStore: InstanceType<typeof SessionStore>;
  let dashboardCalendarService: DashboardCalendarService;
  let userStore: InstanceType<typeof UserStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent, NoopAnimationsModule],
      providers: [
        DashboardCalendarService,
        MotivationQuoteService,
        SessionStoreService,
        provideHttpClient(),
      ],
    }).compileComponents();

    userStore = TestBed.inject(UserStore);
    sessionStore = TestBed.inject(SessionStore);
    dashboardCalendarService = TestBed.inject(DashboardCalendarService);
    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    userStore.reset();
    sessionStore.reset();
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

  it('should render motivation quote', () => {
    const motivationQuote = fixture.debugElement.query(
      By.directive(MotivationQuoteComponent),
    );
    expect(motivationQuote).toBeTruthy();
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

  it('should show the user name', () => {
    userStore.setName('John Doe');

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Hello John Doe, how was your training?',
    );
  });
});
