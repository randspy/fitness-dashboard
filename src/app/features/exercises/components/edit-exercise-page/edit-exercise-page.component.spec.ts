import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExercisePageComponent } from './edit-exercise-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ExerciseStoreService } from '../../services/exercise-store.service';
import { provideTestLogger } from '../../../../../tests/provide-test-logger';

describe('EditExercisePageComponent', () => {
  let component: EditExercisePageComponent;
  let fixture: ComponentFixture<EditExercisePageComponent>;
  let router: Router;
  let exerciseStoreService: ExerciseStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExercisePageComponent],
      providers: [
        provideTestLogger(),
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
    exerciseStoreService = TestBed.inject(ExerciseStoreService);
    fixture = TestBed.createComponent(EditExercisePageComponent);
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
    const form = fixture.debugElement.query(By.css('fit-exercise-form'));

    form.triggerEventHandler('cancel', null);

    expect(navigateSpy).toHaveBeenCalledWith(['../'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
  });

  it('should navigate to parent on submit', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const form = fixture.debugElement.query(By.css('fit-exercise-form'));

    form.triggerEventHandler('save', null);

    expect(navigateSpy).toHaveBeenCalledWith(['../'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
  });

  it('should update exercise on submit', () => {
    const exerciseStoreServiceSpy = jest.spyOn(
      exerciseStoreService,
      'updateExercise',
    );
    const form = fixture.debugElement.query(By.css('fit-exercise-form'));

    fixture.detectChanges();

    const updatedFormExercise = {
      id: '1',
      name: 'Test Exercise',
      description: 'Test Description',
    };

    form.triggerEventHandler('save', updatedFormExercise);

    expect(exerciseStoreServiceSpy).toHaveBeenCalledWith(
      '1',
      updatedFormExercise,
    );
  });
});
