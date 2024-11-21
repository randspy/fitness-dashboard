import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSessionPageComponent } from './edit-session-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { generateSession } from '../../../../../tests/test-object-generators';
import { SessionStoreService } from '../../service/session-store.service';

describe('EditSessionPageComponent', () => {
  let component: EditSessionPageComponent;
  let fixture: ComponentFixture<EditSessionPageComponent>;
  let router: Router;
  let sessionStoreService: SessionStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSessionPageComponent],
      providers: [
        SessionStoreService,
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
    sessionStoreService = TestBed.inject(SessionStoreService);
    fixture = TestBed.createComponent(EditSessionPageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    const updateSessionSpy = jest.spyOn(sessionStoreService, 'updateSession');
    const form = fixture.debugElement.query(By.css('fit-session-form'));

    fixture.detectChanges();

    const updatedSession = generateSession({
      id: '1',
      exercises: [],
    });

    form.triggerEventHandler('save', updatedSession);

    expect(updateSessionSpy).toHaveBeenCalledWith('1', updatedSession);
  });
});
