import { ExerciseStore } from './../../store/exercise.store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseListComponent } from './exercise-list.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Router } from '@angular/router';
import { DraggableListComponent } from '../../../../ui/components/draggable-list/draggable-list.component';

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

  it('should reorder exercises when dragging is completed', () => {
    const initialExercises = [
      { id: '1', name: 'Push-ups', description: 'Basic push-ups' },
      { id: '2', name: 'Squats', description: 'Basic squats' },
      { id: '3', name: 'Pull-ups', description: 'Basic pull-ups' },
    ];
    const reorderedExercises = [
      { id: '2', name: 'Squats', description: 'Basic squats' },
      { id: '1', name: 'Push-ups', description: 'Basic push-ups' },
      { id: '3', name: 'Pull-ups', description: 'Basic pull-ups' },
    ];

    exerciseStore.setExercises(initialExercises);
    fixture.detectChanges();

    const draggableList = fixture.debugElement.query(
      By.directive(DraggableListComponent),
    );
    draggableList.triggerEventHandler('itemsChanged', reorderedExercises);
    fixture.detectChanges();

    expect(exerciseStore.exercises()).toEqual(reorderedExercises);
  });
});
