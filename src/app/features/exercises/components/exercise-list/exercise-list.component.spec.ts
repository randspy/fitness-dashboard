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
import { Exercise } from '../../../../core/exercises/domain/exercise.types';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { generateExercise } from '../../../../../tests/test-object-generators';
import { LinkComponentHarness } from '../../../../../tests/harness/ui/link.harness';
import { ExerciseStoreService } from '../../services/exercise-store.service';
import { provideTestLogger } from '../../../../../tests/provide-test-logger';

describe('ExerciseListComponent', () => {
  let component: ExerciseListComponent;
  let fixture: ComponentFixture<ExerciseListComponent>;
  let exerciseStore: InstanceType<typeof ExerciseStore>;
  let exerciseStoreService: ExerciseStoreService;
  let confirmationService: ConfirmationService;
  let loader: HarnessLoader;

  beforeEach(async () => {
    const mockConfirmationService = {
      requireConfirmation$: new Subject(),
      confirm: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ExerciseListComponent, NoopAnimationsModule],
      providers: [ExerciseStore, provideRouter([]), provideTestLogger()],
    })
      .overrideProvider(ConfirmationService, {
        useValue: mockConfirmationService,
      })
      .compileComponents();

    exerciseStore = TestBed.inject(ExerciseStore);
    exerciseStoreService = TestBed.inject(ExerciseStoreService);
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

  it('should display aria labels for edit button', async () => {
    const exercise = generateExercise({
      name: 'Push-ups',
    });

    exerciseStore.addExercise(exercise);
    fixture.detectChanges();

    const link = await loader.getHarness(LinkComponentHarness);
    expect(link).toBeTruthy();
    expect(await link.getAriaLabel()).toBe('Edit Push-ups exercise');
  });

  it('should display aria labels for delete button', async () => {
    const exercise = generateExercise({
      name: 'Push-ups',
    });

    exerciseStore.addExercise(exercise);
    fixture.detectChanges();

    const button = await loader.getHarness(ButtonComponentHarness);
    expect(button).toBeTruthy();
    expect(await button.getAriaLabel()).toBe('Delete Push-ups exercise');
  });

  it('should reorder exercises when dragging is completed', () => {
    const reorderExercisesSpy = jest.spyOn(
      exerciseStoreService,
      'reorderExercises',
    );

    const initialExercises = [
      generateExercise({
        id: '1',
        position: 0,
      }),
      generateExercise({
        id: '2',
        position: 1,
      }),
      generateExercise({
        id: '3',
        position: 2,
      }),
    ];

    const reorderedExercises = [
      generateExercise({
        id: '2',
        position: 1,
      }),
      generateExercise({
        id: '1',
        position: 0,
      }),
      generateExercise({
        id: '3',
        position: 2,
      }),
    ];

    exerciseStore.setExercises(initialExercises);
    fixture.detectChanges();

    const draggableList = fixture.debugElement.query(
      By.directive(DraggableListComponent),
    );
    draggableList.triggerEventHandler('itemsChanged', reorderedExercises);
    fixture.detectChanges();

    expect(reorderExercisesSpy).toHaveBeenCalledWith(reorderedExercises);
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
    const removeExerciseSpy = jest.spyOn(
      component.exerciseStoreService,
      'removeExercise',
    );
    const exercise = generateExercise({
      id: '1',
    });

    exerciseStore.addExercise(exercise);
    fixture.detectChanges();

    await clickDeleteButton();

    const confirmArgs = (confirmationService.confirm as jest.Mock).mock
      .calls[0][0];
    confirmArgs.accept();

    expect(removeExerciseSpy).toHaveBeenCalledWith('1');
  });

  it('should navigate to edit page when pencil icon is clicked', async () => {
    const exercise: Exercise = generateExercise({
      id: '1',
    });
    exerciseStore.addExercise(exercise);
    fixture.detectChanges();

    const link = await loader.getHarness(LinkComponentHarness);
    expect(link).toBeTruthy();
    expect(await link.getLink()).toBe('/1');
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
