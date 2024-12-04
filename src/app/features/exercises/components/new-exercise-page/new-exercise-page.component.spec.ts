import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewExercisePageComponent } from './new-exercise-page.component';
import { Router, ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ExerciseStoreService } from '../../services/exercise-store.service';
import { provideTestServices } from '../../../../../tests/test-providers';
import { applyConfirmationDialogOverrides } from '../../../../../tests/apply-confirmation-dialog-overrides';

describe('NewExercisePageComponent', () => {
  let component: NewExercisePageComponent;
  let fixture: ComponentFixture<NewExercisePageComponent>;
  let router: Router;
  let exerciseStoreService: ExerciseStoreService;

  beforeEach(async () => {
    await applyConfirmationDialogOverrides(TestBed)
      .configureTestingModule({
        imports: [NewExercisePageComponent, NoopAnimationsModule],
        providers: [
          ...provideTestServices(),
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                url: [{ path: 'app' }, { path: 'exercises' }, { path: 'new' }],
              },
            },
          },
        ],
      })
      .compileComponents();

    router = TestBed.inject(Router);
    exerciseStoreService = TestBed.inject(ExerciseStoreService);
    fixture = TestBed.createComponent(NewExercisePageComponent);
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
    const form = fixture.debugElement.query(By.css('fit-exercise-form'));

    form.triggerEventHandler('cancel', null);

    expect(navigateSpy).toHaveBeenCalledWith(['../'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
  });

  it('should navigate when form is submitted', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const form = fixture.debugElement.query(By.css('fit-exercise-form'));

    form.triggerEventHandler('save', null);
    expect(navigateSpy).toHaveBeenCalledWith(['../'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
  });

  it('should save the exercise in the store', () => {
    const addExerciseSpy = jest.spyOn(exerciseStoreService, 'addExercise');
    const form = fixture.debugElement.query(By.css('fit-exercise-form'));

    const exerciseForm = {
      id: '1',
      name: 'Test Exercise',
      description: 'Test Description',
    };

    form.triggerEventHandler('save', exerciseForm);

    expect(addExerciseSpy).toHaveBeenCalledWith(exerciseForm);
  });

  it('should have a dialog', () => {
    const dialog = fixture.debugElement.query(
      By.css('fit-confirmation-dialog'),
    );
    expect(dialog).toBeTruthy();
  });
});
