import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewExercisePageComponent } from './new-exercise-page.component';
import { Router, ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ExerciseStore } from '../../store/exercise.store';

describe('NewExercisePageComponent', () => {
  let component: NewExercisePageComponent;
  let fixture: ComponentFixture<NewExercisePageComponent>;
  let router: Router;
  let exerciseStore: InstanceType<typeof ExerciseStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewExercisePageComponent, NoopAnimationsModule],
      providers: [
        ExerciseStore,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: [{ path: 'app' }, { path: 'exercises' }, { path: 'new' }],
            },
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(NewExercisePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    exerciseStore = TestBed.inject(ExerciseStore);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks
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
    const addExerciseSpy = jest.spyOn(exerciseStore, 'addExercise');
    const form = fixture.debugElement.query(By.css('fit-exercise-form'));

    const exercise = {
      id: '',
      name: 'Push-ups',
      description: 'Description',
    };

    form.triggerEventHandler('save', exercise);

    expect(addExerciseSpy).toHaveBeenCalledWith(exercise);
  });
});
