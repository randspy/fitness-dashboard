import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSessionPageComponent } from './new-session-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStore } from '../../../../core/sessions/store/sessions.store';
import { By } from '@angular/platform-browser';

describe('NewSessionPageComponent', () => {
  let component: NewSessionPageComponent;
  let fixture: ComponentFixture<NewSessionPageComponent>;
  let router: Router;
  let sessionStore: InstanceType<typeof SessionStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSessionPageComponent],
      providers: [
        SessionStore,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: [{ path: 'app' }, { path: 'sessions' }, { path: 'new' }],
            },
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(NewSessionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    sessionStore = TestBed.inject(SessionStore);
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back when cancel is clicked', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const form = fixture.debugElement.query(By.css('fit-session-form'));

    form.triggerEventHandler('cancel', null);

    expect(navigateSpy).toHaveBeenCalledWith(['../'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
  });

  it('should navigate when form is submitted', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const form = fixture.debugElement.query(By.css('fit-session-form'));

    form.triggerEventHandler('save', null);
    expect(navigateSpy).toHaveBeenCalledWith(['../'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
  });

  it('should save the session in the store', () => {
    const addSessionSpy = jest.spyOn(sessionStore, 'addSession');
    const form = fixture.debugElement.query(By.css('fit-session-form'));

    const session = {
      id: '',
      date: new Date(),
      exercises: [],
    };

    form.triggerEventHandler('save', session);

    expect(addSessionSpy).toHaveBeenCalledWith(session);
  });
});
