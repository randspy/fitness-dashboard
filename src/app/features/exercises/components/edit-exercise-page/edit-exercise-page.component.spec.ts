import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExercisePageComponent } from './edit-exercise-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseStore } from '../../../../core/exercises/store/exercise.store';
import { By } from '@angular/platform-browser';
import { generateExercise } from '../../../../../../setup-jest';

describe('EditExercisePageComponent', () => {
  let component: EditExercisePageComponent;
  let fixture: ComponentFixture<EditExercisePageComponent>;
  let router: Router;
  let exerciseStore: InstanceType<typeof ExerciseStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExercisePageComponent],
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
    exerciseStore = TestBed.inject(ExerciseStore);
    fixture = TestBed.createComponent(EditExercisePageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    exerciseStore.reset();
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
    const exerciseStoreSpy = jest.spyOn(exerciseStore, 'updateExercise');
    const form = fixture.debugElement.query(By.css('fit-exercise-form'));
    fixture.detectChanges();

    const updatedFormExercise = {
      id: '1',
      name: 'Test Exercise',
      description: 'Test Description',
    };

    form.triggerEventHandler('save', updatedFormExercise);

    expect(exerciseStoreSpy).toHaveBeenCalledWith(
      '1',
      generateExercise(updatedFormExercise),
    );
  });
});
