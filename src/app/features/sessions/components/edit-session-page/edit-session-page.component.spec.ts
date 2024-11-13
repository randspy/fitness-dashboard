import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSessionPageComponent } from './edit-session-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { SessionStore } from '../../../../core/sessions/store/sessions.store';
import { generateSession } from '../../../../../../setup-jest';

describe('EditSessionPageComponent', () => {
  let component: EditSessionPageComponent;
  let fixture: ComponentFixture<EditSessionPageComponent>;
  let router: Router;
  let sessionStore: InstanceType<typeof SessionStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSessionPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: [{ path: 'app' }, { path: 'sessions' }, { path: '1' }],
            },
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    sessionStore = TestBed.inject(SessionStore);
    fixture = TestBed.createComponent(EditSessionPageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStore.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to parent on cancel', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const form = fixture.debugElement.query(By.css('fit-session-form'));

    form.triggerEventHandler('cancel', null);

    expect(navigateSpy).toHaveBeenCalledWith(['../'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
  });

  it('should navigate to parent on submit', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const form = fixture.debugElement.query(By.css('fit-session-form'));

    form.triggerEventHandler('save', null);

    expect(navigateSpy).toHaveBeenCalledWith(['../'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
  });

  it('should update session on submit', () => {
    const form = fixture.debugElement.query(By.css('fit-session-form'));
    const session = generateSession({
      id: '1',
    });

    sessionStore.addSession(session);

    fixture.detectChanges();

    const updatedSession = {
      ...session,
      exercises: [
        {
          name: 'Test Exercise',
        },
      ],
    };

    form.triggerEventHandler('save', updatedSession);

    expect(sessionStore.sessions()).toEqual([updatedSession]);
  });
});
