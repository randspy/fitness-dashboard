import { ExerciseStore } from '../../../../core/exercises/store/exercise.store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseListComponent } from './exercise-list.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { provideRouter } from '@angular/router';
import { DraggableListComponent } from '../../../../ui/components/draggable-list/draggable-list.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { ButtonComponentHarness } from '../../../../../tests/harness/ui/button.harness';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Exercise } from '../../../../core/exercises/domain/exercise.model';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { generateExercise } from '../../../../../../setup-jest';
import { LinkComponentHarness } from '../../../../../tests/harness/ui/link.harness';

describe('ExerciseListComponent', () => {
  let component: ExerciseListComponent;
  let fixture: ComponentFixture<ExerciseListComponent>;
  let exerciseStore: InstanceType<typeof ExerciseStore>;
  let confirmationService: ConfirmationService;
  let loader: HarnessLoader;

  beforeEach(async () => {
    const mockConfirmationService = {
      requireConfirmation$: new Subject(),
      confirm: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ExerciseListComponent, NoopAnimationsModule],
      providers: [ExerciseStore, provideRouter([])],
    })
      .overrideProvider(ConfirmationService, {
        useValue: mockConfirmationService,
      })
      .compileComponents();

    exerciseStore = TestBed.inject(ExerciseStore);
    fixture = TestBed.createComponent(ExerciseListComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    confirmationService =
      fixture.debugElement.injector.get(ConfirmationService);
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
    const exercise = generateExercise({
      name: 'Push-ups',
    });

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
      generateExercise({
        id: '1',
        name: 'Push-ups',
        description: 'Basic push-ups',
      }),
      generateExercise({
        id: '2',
        name: 'Squats',
        description: 'Basic squats',
      }),
      generateExercise({
        id: '3',
        name: 'Pull-ups',
        description: 'Basic pull-ups',
      }),
    ];
    const reorderedExercises = [
      generateExercise({
        id: '2',
        name: 'Squats',
        description: 'Basic squats',
      }),
      generateExercise({
        id: '1',
        name: 'Push-ups',
        description: 'Basic push-ups',
      }),
      generateExercise({
        id: '3',
        name: 'Pull-ups',
        description: 'Basic pull-ups',
      }),
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

  it('should display the delete modal', async () => {
    const exercise = generateExercise({
      id: '1',
    });

    exerciseStore.addExercise(exercise);
    fixture.detectChanges();

    await clickDeleteButton();

    expect(confirmationService.confirm).toHaveBeenCalled();
  });

  it('should remove exercise when confirmed', async () => {
    const exercise = generateExercise({
      id: '1',
    });

    exerciseStore.addExercise(exercise);
    fixture.detectChanges();

    await clickDeleteButton();

    const confirmArgs = (confirmationService.confirm as jest.Mock).mock
      .calls[0][0];
    confirmArgs.accept();

    expect(exerciseStore.exercises()).toEqual([]);
  });

  it('should navigate to edit page when pencil icon is clicked', async () => {
    const exercise: Exercise = generateExercise({
      id: '1',
    });
    exerciseStore.addExercise(exercise);
    fixture.detectChanges();

    const link = await loader.getHarness(LinkComponentHarness);
    expect(link).toBeTruthy();
    expect(await link.getLink()).toBe('1');
  });

  const clickDeleteButton = async () => {
    const deleteButton = await loader.getHarness(
      ButtonComponentHarness.with({
        testId: 'delete-button',
      }),
    );
    await deleteButton.click();
  };
});
