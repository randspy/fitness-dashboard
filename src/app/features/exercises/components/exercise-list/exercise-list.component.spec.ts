import { ExerciseStore } from './../../store/exercise.store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseListComponent } from './exercise-list.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Router } from '@angular/router';

describe('ExerciseListComponent', () => {
  let component: ExerciseListComponent;
  let fixture: ComponentFixture<ExerciseListComponent>;
  let exerciseStore: InstanceType<typeof ExerciseStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseListComponent, NoopAnimationsModule],
      providers: [
        ExerciseStore,
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    exerciseStore = TestBed.inject(ExerciseStore);
    fixture = TestBed.createComponent(ExerciseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    exerciseStore.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty state when no exercises', () => {
    const emptyState = fixture.debugElement.query(
      By.css('[data-testid="empty-state"]'),
    );
    expect(emptyState).toBeTruthy();
    expect(emptyState.nativeElement.textContent).toBe('No exercises');
  });

  it('should display exercises when available', () => {
    const exercise = {
      name: 'Push-ups',
      description: 'Basic push-ups',
    };
    exerciseStore.addExercise(exercise);
    fixture.detectChanges();

    const exerciseElements = fixture.debugElement.queryAll(
      By.css('[data-testid="exercise-item"]'),
    );
    expect(exerciseElements.length).toBe(1);
    expect(exerciseElements[0].nativeElement.textContent).toBe(exercise.name);
  });
});
