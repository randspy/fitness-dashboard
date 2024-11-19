import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponentHarness } from '../../../../../tests/harness/ui/button.harness';
import { By } from '@angular/platform-browser';
import { CardComponentHarness } from '../../../../../tests/harness/ui/card.harness';
import { DatepickerComponentHarness } from '../../../../../tests/harness/ui/datepicker.harness';
import { DebugElement } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { InputComponentHarness } from '../../../../../tests/harness/ui/input.harness';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SessionFormComponent } from './session-form.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { cloneDeep } from 'lodash';
import { SelectComponentHarness } from '../../../../../tests/harness/ui/select.harness';
import { ExerciseStore } from '../../../exercises/store/exercise.store';
import { generateExercise } from '../../../../../../setup-jest';
import { Session } from '../../../../core/sessions/domain/session.model';

describe('SessionFormComponent', () => {
  let component: SessionFormComponent;
  let fixture: ComponentFixture<SessionFormComponent>;
  let loader: HarnessLoader;
  let exerciseStore: InstanceType<typeof ExerciseStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionFormComponent, NoopAnimationsModule],
    }).compileComponents();

    exerciseStore = TestBed.inject(ExerciseStore);
    fixture = TestBed.createComponent(SessionFormComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
  });

  describe('new session', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    afterEach(() => {
      jest
        .spyOn(global.crypto, 'randomUUID')
        .mockReturnValue(
          'test-uuid' as `${string}-${string}-${string}-${string}-${string}`,
        );
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with today date', () => {
      const today = new Date(new Date().setHours(0, 0, 0, 0));

      // only way to check that the date is set to today's date at 00:00:00
      // as the datepicker only contains the date without the time
      expect(component.form.get('date')?.value).toEqual(today);
    });

    it('should change session name', async () => {
      changeSessionNameInput('Test session');
      fixture.detectChanges();
      await fixture.whenStable();

      const sessionName = await sessionNameInput();
      expect(await sessionName.getValue()).toBe('Test session');
    });

    it('should change date', async () => {
      await changeDateInput(new Date('01/01/2024'));
      fixture.detectChanges();

      await fixture.whenStable();

      const date = await loader.getHarness(DatepickerComponentHarness);
      expect(await date.getValue()).toBe('01/01/2024');
    });

    it('should initialize with one exercise and one set', async () => {
      const exercises = exerciseElements();
      expect(exercises.length).toBe(1);

      const exerciseName = await exerciseNameSelect(0);
      expect(await exerciseName.getValue()).toBe('');

      const sets = setElementsQuery(exercises[0]);
      expect(sets.length).toBe(1);

      const repetitions = await repetitionsInput(0, 0);
      expect(await repetitions.getValue()).toBe('1');

      const weight = await weightInput(0, 0);
      expect(await weight.getValue()).toBe('0');
    });

    it('should add new exercise', async () => {
      jest
        .spyOn(global.crypto, 'randomUUID')
        .mockReturnValue('11111111-1111-1111-1111-111111111111');

      const addExerciseButton = await loader.getHarness(
        ButtonComponentHarness.with({
          testId: 'add-exercise-button',
        }),
      );

      await addExerciseButton.click();

      const exercises = exerciseElements();
      expect(exercises.length).toBe(2);

      const exerciseName = await exerciseNameSelect(1);
      expect(await exerciseName.getValue()).toBe('');

      const sets = setElementsQuery(exercises[1]);
      expect(sets.length).toBe(1);

      const repetitions = await repetitionsInput(1, 0);
      expect(await repetitions.getValue()).toBe('1');

      const weight = await weightInput(1, 0);
      expect(await weight.getValue()).toBe('0');
    });

    it('should remove exercise', async () => {
      const removeExerciseButton = await loader.getHarness(
        ButtonComponentHarness.with({
          testId: 'remove-exercise-button-0',
        }),
      );

      await removeExerciseButton.click();

      const exercises = exerciseElements();
      expect(exercises.length).toBe(0);
    });

    it('should add new set to exercise', async () => {
      jest
        .spyOn(global.crypto, 'randomUUID')
        .mockReturnValue('11111111-1111-1111-1111-111111111111');

      const addSetButton = await loader.getHarness(
        ButtonComponentHarness.with({
          testId: 'add-set-button-0',
        }),
      );

      await addSetButton.click();

      const exercises = exerciseElements();
      const sets = setElementsQuery(exercises[0]);

      expect(sets.length).toBe(2);

      const repetitions = await repetitionsInput(0, 1);
      expect(await repetitions.getValue()).toBe('1');

      const weight = await weightInput(0, 1);
      expect(await weight.getValue()).toBe('0');
    });

    it('should remove set from exercise', async () => {
      const removeSetButton = await loader.getHarness(
        ButtonComponentHarness.with({
          testId: 'remove-set-button-0-0',
        }),
      );

      await removeSetButton.click();

      const sets = setElementsQuery(exerciseElements()[0]);
      expect(sets.length).toBe(0);
    });

    it('should emit cancel event', async () => {
      const cancelSpy = jest.spyOn(component.cancel, 'emit');
      const cancelButton = await loader.getHarness(
        ButtonComponentHarness.with({
          testId: 'cancel-button',
        }),
      );

      await cancelButton.click();

      expect(cancelSpy).toHaveBeenCalled();
    });

    it('should emit save event with valid form data', async () => {
      const saveSpy = jest.spyOn(component.save, 'emit');

      await changeSessionNameInput('Test session');
      await changeExerciseInput(0, 'exercise-1');

      saveForm();

      expect(saveSpy).toHaveBeenCalledWith({
        date: expect.any(Date),
        id: 'test-uuid',
        name: 'Test session',
        exercises: [
          {
            id: 'test-uuid',
            exerciseId: 'exercise-1',
            sets: [{ id: 'test-uuid', repetitions: 1, weight: 0 }],
          },
        ],
      });
    });

    describe('validation', () => {
      it('should show error for session name', async () => {
        saveForm();

        const sessionName = await sessionNameInput();
        expect(await sessionName.isInvalid()).toBe(true);
        expect(await sessionName.isTouched()).toBe(true);
        expect(await sessionName.getErrorMessage()).toBe(
          'Session name is required',
        );
      });

      it('should show error for date', async () => {
        changeDateInput(null);
        saveForm();

        const datePicker = await datepickerInput();
        expect(await datePicker.isInvalid()).toBe(true);
        expect(await datePicker.isTouched()).toBe(true);
        expect(await datePicker.getErrorMessage()).toBe('Date is required');
      });

      it('should show error for exercise name', async () => {
        saveForm();
        fixture.detectChanges();

        const exerciseName = await exerciseNameSelect(0);
        expect(await exerciseName.isInvalid()).toBe(true);
        expect(await exerciseName.isTouched()).toBe(true);
        expect(await exerciseName.getErrorMessage()).toBe(
          'Exercise name is required',
        );
      });

      it('should show error for missing repetitions', async () => {
        await changeRepetitionsInput(0, 0, '');

        const repetitions = await repetitionsInput(0, 0);
        expect(await repetitions.isInvalid()).toBe(true);
        expect(await repetitions.isTouched()).toBe(true);
        expect(await repetitions.getErrorMessage()).toBe(
          'Repetitions is required',
        );
      });

      it('should show error for invalid repetitions', async () => {
        await changeRepetitionsInput(0, 0, '0');
        fixture.detectChanges();

        const repetitions = await repetitionsInput(0, 0);
        expect(await repetitions.isInvalid()).toBe(true);
        expect(await repetitions.isTouched()).toBe(true);
        expect(await repetitions.getErrorMessage()).toBe(
          'Repetitions must be at least 1',
        );
      });

      it('should show error for missing weight', async () => {
        await changeWeightInput(0, 0, '');
        fixture.detectChanges();

        const weight = await weightInput(0, 0);
        expect(await weight.isInvalid()).toBe(true);
        expect(await weight.isTouched()).toBe(true);
        expect(await weight.getErrorMessage()).toBe('Weight is required');
      });

      it('should show error for invalid weight', async () => {
        await changeWeightInput(0, 0, '-1');
        fixture.detectChanges();

        const weight = await weightInput(0, 0);
        expect(await weight.isInvalid()).toBe(true);
        expect(await weight.isTouched()).toBe(true);
        expect(await weight.getErrorMessage()).toBe(
          'Weight must be at least 0',
        );
      });
    });

    describe('canDeactivate', () => {
      it('should return true after form is submitted', async () => {
        await changeSessionNameInput('Test session');
        await changeExerciseInput(0, 'Push-ups');
        saveForm();

        expect(component.canDeactivate()).toBeTruthy();
      });

      it('should return true when form is pristine', () => {
        expect(component.canDeactivate()).toBeTruthy();
      });

      it('should return true when form is dirty but has not changed', async () => {
        await changeExerciseInput(0, '');

        expect(component.canDeactivate()).toBeTruthy();
      });

      it('should return false when form is dirty and has changed', async () => {
        await changeExerciseInput(0, 'Push-ups');

        expect(component.canDeactivate()).toBeFalsy();
      });
    });

    it('should set form header to "Custom Session"', async () => {
      fixture.componentRef.setInput('header', 'Custom Header');
      fixture.detectChanges();

      const card = await loader.getHarness(CardComponentHarness);
      expect(await card.getHeaderText()).toBe('Custom Header');
    });
  });

  describe('edit session', () => {
    let session: Session;

    beforeEach(() => {
      session = {
        id: 'session-1',
        name: 'Session',
        date: new Date(),
        exercises: [
          {
            id: 'ex-1',
            exerciseId: 'exercise-1',
            sets: [
              { id: 'set-1', repetitions: 3, weight: 4 },
              { id: 'set-2', repetitions: 5, weight: 6 },
            ],
          },
          {
            id: 'ex-2',
            exerciseId: 'exercise-2',
            sets: [{ id: 'set-3', repetitions: 7, weight: 8 }],
          },
        ],
      };

      exerciseStore.setExercises([
        generateExercise({ id: 'exercise-1', name: 'Push-ups' }),
        generateExercise({ id: 'exercise-2', name: 'Pull-ups' }),
      ]);
      fixture.componentRef.setInput('session', session);
      fixture.detectChanges();
    });

    it('should update existing session', async () => {
      const saveSpy = jest.spyOn(component.save, 'emit');

      await changeSessionNameInput('Test session');

      saveForm();

      fixture.detectChanges();

      const result = { ...cloneDeep(session), name: 'Test session' };

      expect(saveSpy).toHaveBeenCalledWith(result);
    });

    it('should display exercise value', async () => {
      await changeExerciseInput(0, 'exercise-1');
      fixture.detectChanges();

      const exerciseName = await exerciseNameSelect(0);
      expect(await exerciseName.getValue()).toBe('Push-ups');
    });
  });

  const exerciseElements = () =>
    fixture.debugElement.queryAll(By.css('div[data-testid^="exercise"]'));

  const setElementsQuery = (exerciseElement: DebugElement) =>
    exerciseElement.queryAll(By.css('div[data-testid^="set"]'));

  const datepickerInput = async () =>
    await loader.getHarness(DatepickerComponentHarness);

  const repetitionsInput = async (exerciseIndex: number, setIndex: number) =>
    await loader.getHarness(
      InputComponentHarness.with({
        within: {
          selector: 'div[data-testid^="exercise"]',
          index: exerciseIndex,
          path: [
            { selector: 'div[data-testid^="set"]', index: setIndex },
            { selector: 'fit-input[formControlName="repetitions"]' },
          ],
        },
      }),
    );

  const weightInput = async (exerciseIndex: number, setIndex: number) =>
    await loader.getHarness(
      InputComponentHarness.with({
        within: {
          selector: 'div[data-testid^="exercise"]',
          index: exerciseIndex,
          path: [
            { selector: 'div[data-testid^="set"]', index: setIndex },
            { selector: 'fit-input[formControlName="weight"]' },
          ],
        },
      }),
    );

  const exerciseNameSelect = async (index: number) =>
    await loader.getHarness(
      SelectComponentHarness.with({
        within: {
          selector: 'div[data-testid^="exercise"]',
          index,
        },
      }),
    );

  const sessionNameInput = async () =>
    await loader.getHarness(
      InputComponentHarness.with({
        formControlName: 'name',
      }),
    );

  const saveButton = () => fixture.debugElement.query(By.css('form'));

  const saveForm = () => saveButton().triggerEventHandler('submit', null);

  const changeRepetitionsInput = async (
    exerciseIndex: number,
    setIndex: number,
    value: string,
  ) => {
    const repetitions = await repetitionsInput(exerciseIndex, setIndex);
    await repetitions.setValue(value);
  };

  const changeWeightInput = async (
    exerciseIndex: number,
    setIndex: number,
    value: string,
  ) => {
    const weight = await weightInput(exerciseIndex, setIndex);
    await weight.setValue(value);
  };

  const changeExerciseInput = async (exerciseIndex: number, value: string) => {
    const exerciseName = await exerciseNameSelect(exerciseIndex);
    await exerciseName.setValue(value);
  };

  const changeDateInput = async (date: Date | null) => {
    if (date) {
      const datepicker = await datepickerInput();
      await datepicker.setValue(date);
    } else {
      // changing input in the template didn't work
      const dateControl = component.form.get('date');
      dateControl?.setValue(null);
      dateControl?.markAsTouched();
    }
  };

  const changeSessionNameInput = async (value: string) => {
    const input = await sessionNameInput();
    await input.setValue(value);
  };
});
