import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionListComponent } from './session-list.component';
import { By } from '@angular/platform-browser';
import { SessionStore } from '../../store/sessions.store';
import { Session } from '../../domain/session.model';
import { DatePipe } from '@angular/common';

describe('SessionListComponent', () => {
  let component: SessionListComponent;
  let fixture: ComponentFixture<SessionListComponent>;
  let sessionStore: InstanceType<typeof SessionStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionListComponent, DatePipe],
    }).compileComponents();

    sessionStore = TestBed.inject(SessionStore);
    fixture = TestBed.createComponent(SessionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStore.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty state when no sessions', () => {
    const emptyState = fixture.debugElement.query(
      By.css('[data-testid="empty-state"]'),
    );
    expect(emptyState).toBeTruthy();
    expect(emptyState.nativeElement.textContent).toBe('No sessions');
  });

  it('should display sessions when available', () => {
    const session: Session = {
      id: '1',
      name: 'Push-ups',
      date: new Date('2024-03-14T12:00:00Z'),
      exercises: [],
    };
    sessionStore.addSession(session);
    fixture.detectChanges();

    const sessionElements = fixture.debugElement.queryAll(
      By.css('[data-testid="session-item"]'),
    );
    expect(sessionElements.length).toBe(1);
    expect(sessionElements[0].nativeElement.textContent).toContain(
      session.name,
    );
    expect(sessionElements[0].nativeElement.textContent).toContain(
      new DatePipe('en-US').transform(session.date),
    );
  });

  it('should display sessions in descending order', () => {
    const session1: Session = {
      id: '1',
      name: 'Push-ups',
      date: new Date('2024-03-08T12:00:00Z'),
      exercises: [],
    };
    const session2: Session = {
      id: '2',
      name: 'Pull-ups',
      date: new Date('2024-03-13T12:00:00Z'),
      exercises: [],
    };
    sessionStore.addSession(session1);
    sessionStore.addSession(session2);
    fixture.detectChanges();

    const sessionElements = fixture.debugElement.queryAll(
      By.css('[data-testid="session-item"]'),
    );
    expect(sessionElements.length).toBe(2);
    expect(sessionElements[0].nativeElement.textContent).toContain(
      session2.name,
    );
    expect(sessionElements[1].nativeElement.textContent).toContain(
      session1.name,
    );
  });
});
