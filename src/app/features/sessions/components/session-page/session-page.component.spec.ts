import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionPageComponent } from './session-page.component';
import { provideRouter } from '@angular/router';
import { SessionStore } from '../../../../core/sessions/store/sessions.store';
import { Session } from '../../../../core/sessions/domain/session.model';
import { By } from '@angular/platform-browser';
import { SessionListComponent } from '../../../../core/sessions/components/session-list/session-list.component';

describe('SessionPageComponent', () => {
  let component: SessionPageComponent;
  let fixture: ComponentFixture<SessionPageComponent>;
  let sessionStore: InstanceType<typeof SessionStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    sessionStore = TestBed.inject(SessionStore);
    fixture = TestBed.createComponent(SessionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStore.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a link to the new session page', () => {
    const link = fixture.nativeElement.querySelector('fit-link');
    expect(link).toBeTruthy();
    expect(link.getAttribute('link')).toBe('new');
  });

  it('should have a exercise list', () => {
    const sessionList = fixture.nativeElement.querySelector('fit-session-list');
    expect(sessionList).toBeTruthy();
  });

  it('should forward sessions to the session list', () => {
    const session: Session = {
      id: '1',
      name: 'Push-ups',
      date: new Date(),
      exercises: [],
    };
    sessionStore.setSessions([session]);
    fixture.detectChanges();

    const sessionList = fixture.debugElement.query(
      By.directive(SessionListComponent),
    );
    expect(sessionList.componentInstance.sessions()).toEqual([session]);
  });
});
