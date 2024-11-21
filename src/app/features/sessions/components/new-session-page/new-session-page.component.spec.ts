import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSessionPageComponent } from './new-session-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { SessionStoreService } from '../../service/session-store.service';
import { generateSession } from '../../../../../../setup-jest';

describe('NewSessionPageComponent', () => {
  let component: NewSessionPageComponent;
  let fixture: ComponentFixture<NewSessionPageComponent>;
  let router: Router;
  let sessionStoreService: SessionStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSessionPageComponent],
      providers: [
        SessionStoreService,
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
    sessionStoreService = TestBed.inject(SessionStoreService);
    fixture = TestBed.createComponent(NewSessionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
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

    form.triggerEventHandler('save', generateSession({ id: '1' }));
    expect(navigateSpy).toHaveBeenCalledWith(['../'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
  });

  it('should save the session in the store', () => {
    const addSessionSpy = jest.spyOn(sessionStoreService, 'addSession');
    const form = fixture.debugElement.query(By.css('fit-session-form'));

    const session = generateSession({ id: '1' });

    form.triggerEventHandler('save', session);

    expect(addSessionSpy).toHaveBeenCalledWith(session);
  });
});
