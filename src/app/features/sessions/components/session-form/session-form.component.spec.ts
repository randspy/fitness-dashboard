import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionFormComponent } from './session-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('SessionFormComponent', () => {
  let component: SessionFormComponent;
  let fixture: ComponentFixture<SessionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionFormComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with today date', () => {
    const today = new Date();
    const expectedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const dateInput = dateInputElement();
    const actualDate = new Date(dateInput.value);
    const formattedActualDate = actualDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    expect(formattedActualDate).toBe(expectedDate);
  });
  it('should change date', async () => {
    changeDateInput(new Date('01/01/2024'));
    fixture.detectChanges();

    await fixture.whenStable();

    expect(dateInputElement().value).toBe('01/01/2024');
  });

  it('should initialize with one exercise and one set', () => {
    const exercises = exerciseElements();
    expect(exercises.length).toBe(1);

    const exerciseNameInput = nameInputElement(exercises[0]);
    expect(exerciseNameInput.value).toBe('');

    const sets = setElementsQuery(exercises[0]);
    expect(sets.length).toBe(1);

    const repetitionsInput = repetitionInputElement(sets[0]);
    expect(repetitionsInput.value).toBe('1');

    const weightInput = weightInputElement(sets[0]);
    expect(weightInput.value).toBe('0');
  });

  it('should add new exercise', async () => {
    addExerciseButton().triggerEventHandler('click', null);

    fixture.detectChanges();
    await fixture.whenStable();

    const exercises = exerciseElements();
    expect(exercises.length).toBe(2);

    const exerciseNameInput = nameInputElement(exercises[1]);
    expect(exerciseNameInput.value).toBe('');

    const sets = setElementsQuery(exercises[1]);
    expect(sets.length).toBe(1);

    const repetitionsInput = repetitionInputElement(sets[0]);
    expect(repetitionsInput.value).toBe('1');

    const weightInput = weightInputElement(sets[0]);
    expect(weightInput.value).toBe('0');
  });

  it('should remove exercise', () => {
    removeExerciseButton(0).triggerEventHandler('click', null);
    fixture.detectChanges();

    const exercises = exerciseElements();
    expect(exercises.length).toBe(0);
  });

  it('should add new set to exercise', async () => {
    addSetButton(0).triggerEventHandler('click', null);

    fixture.detectChanges();
    await fixture.whenStable();

    const exercises = exerciseElements();
    const sets = setElementsQuery(exercises[0]);

    expect(sets.length).toBe(2);

    const repetitionsInput = repetitionInputElement(sets[1]);
    expect(repetitionsInput.value).toBe('1');

    const weightInput = weightInputElement(sets[1]);
    expect(weightInput.value).toBe('0');
  });

  it('should remove set from exercise', () => {
    removeSetButton(0, 0).triggerEventHandler('click', null);

    fixture.detectChanges();

    const sets = setElementsQuery(exerciseElements()[0]);
    expect(sets.length).toBe(0);
  });

  it('should emit cancel event', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');

    cancelButton().triggerEventHandler('click', null);

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should emit save event with valid form data', () => {
    const saveSpy = jest.spyOn(component.save, 'emit');

    changeExerciseNameInput(0, 'Push-ups');
    saveButton().triggerEventHandler('submit', null);

    fixture.detectChanges();

    expect(saveSpy).toHaveBeenCalledWith({
      date: expect.any(Date),
      id: 'test-uuid',
      exercises: [
        {
          id: 'test-uuid',
          name: 'Push-ups',
          sets: [{ id: 'test-uuid', repetitions: 1, weight: 0 }],
        },
      ],
    });
  });

  describe('validation', () => {
    it('should show errors for date', async () => {
      changeDateInput(null);
      saveButton().triggerEventHandler('submit', null);

      fixture.detectChanges();

      const datePicker = datepickerElement();

      expect(datePicker.classList.contains('ng-invalid')).toBe(true);
      expect(datePicker.classList.contains('ng-touched')).toBe(true);

      expect(errorMessageElement(datePicker)).toBe('Date is required');
    });

    it('should show errors for exercise name', async () => {
      saveButton().triggerEventHandler('submit', null);
      fixture.detectChanges();

      await fixture.whenStable();

      const exerciseNameInput = nameInputElement(exerciseElements()[0]);
      expect(exerciseNameInput.classList.contains('ng-invalid')).toBe(true);
      expect(exerciseNameInput.classList.contains('ng-touched')).toBe(true);
      expect(errorMessageElement(exerciseNameInput.parentElement)).toBe(
        'Exercise name is required',
      );
    });

    it('should show error for missing repetitions', async () => {
      changeRepetitionsInput(0, 0, '');

      fixture.detectChanges();
      await fixture.whenStable();

      const repetitionsInput = repetitionInputElement(
        setElementsQuery(exerciseElements()[0])[0],
      );

      expect(repetitionsInput.classList.contains('ng-invalid')).toBe(true);
      expect(repetitionsInput.classList.contains('ng-touched')).toBe(true);
      expect(errorMessageElement(repetitionsInput.parentElement)).toBe(
        'Repetitions is required',
      );
    });

    it('should show error for invalid repetitions', async () => {
      changeRepetitionsInput(0, 0, '0');
      fixture.detectChanges();
      await fixture.whenStable();

      const repetitionsInput = repetitionInputElement(
        setElementsQuery(exerciseElements()[0])[0],
      );

      expect(repetitionsInput.classList.contains('ng-invalid')).toBe(true);
      expect(repetitionsInput.classList.contains('ng-touched')).toBe(true);
      expect(errorMessageElement(repetitionsInput.parentElement)).toBe(
        'Repetitions must be at least 1',
      );
    });

    it('should show error for invalid weight', async () => {
      changeWeightInput(0, 0, '');
      fixture.detectChanges();
      await fixture.whenStable();

      const weightInput = weightInputElement(
        setElementsQuery(exerciseElements()[0])[0],
      );

      expect(weightInput.classList.contains('ng-invalid')).toBe(true);
      expect(weightInput.classList.contains('ng-touched')).toBe(true);
      expect(errorMessageElement(weightInput.parentElement)).toBe(
        'Weight is required',
      );
    });

    it('should show error for invalid weight', async () => {
      changeWeightInput(0, 0, '-1');
      fixture.detectChanges();
      await fixture.whenStable();

      const weightInput = weightInputElement(
        setElementsQuery(exerciseElements()[0])[0],
      );

      expect(weightInput.classList.contains('ng-invalid')).toBe(true);
      expect(weightInput.classList.contains('ng-touched')).toBe(true);
      expect(errorMessageElement(weightInput.parentElement)).toBe(
        'Weight must be at least 0',
      );
    });
  });

  const exerciseElements = () =>
    fixture.debugElement.queryAll(By.css('div[data-testid^="exercise"]'));

  const nameInputElement = (exerciseElement: DebugElement) =>
    exerciseElement.query(By.css('[formControlName="name"] input'))
      .nativeElement;

  const setElementsQuery = (exerciseElement: DebugElement) =>
    exerciseElement.queryAll(By.css('div[data-testid^="set"]'));

  const repetitionInputElement = (setElement: DebugElement) =>
    setElement.query(By.css('[formControlName="repetitions"] input'))
      .nativeElement;

  const weightInputElement = (setElement: DebugElement) =>
    setElement.query(By.css('[formControlName="weight"] input')).nativeElement;

  const datepickerElement = () =>
    fixture.debugElement.query(By.css('[formControlName="date"]'))
      .nativeElement;

  const dateInputElement = () =>
    fixture.debugElement.query(By.css('[formControlName="date"] input'))
      .nativeElement;

  const errorMessageElement = (element: HTMLElement) =>
    element.querySelector('.text-error')?.textContent;

  const addExerciseButton = () =>
    fixture.debugElement.query(By.css('[data-testid="add-exercise-button"]'));

  const removeExerciseButton = (exerciseIndex: number) =>
    fixture.debugElement.query(
      By.css(`[data-testid="remove-exercise-button-${exerciseIndex}"]`),
    );

  const addSetButton = (exerciseIndex: number) =>
    fixture.debugElement.query(
      By.css(`[data-testid="add-set-button-${exerciseIndex}"]`),
    );

  const removeSetButton = (exerciseIndex: number, setIndex: number) =>
    fixture.debugElement.query(
      By.css(`[data-testid="remove-set-button-${exerciseIndex}-${setIndex}"]`),
    );

  const cancelButton = () =>
    fixture.debugElement.query(By.css('[data-testid="cancel-button"]'));

  const saveButton = () => fixture.debugElement.query(By.css('form'));

  const changeRepetitionsInput = (
    exerciseIndex: number,
    setIndex: number,
    value: string,
  ) => {
    const repetitionsInput = repetitionInputElement(
      setElementsQuery(exerciseElements()[exerciseIndex])[setIndex],
    );
    repetitionsInput.value = value;
    repetitionsInput.dispatchEvent(new Event('input'));
  };

  const changeWeightInput = (
    exerciseIndex: number,
    setIndex: number,
    value: string,
  ) => {
    const weightInput = weightInputElement(
      setElementsQuery(exerciseElements()[exerciseIndex])[setIndex],
    );
    weightInput.value = value;
    weightInput.dispatchEvent(new Event('input'));
  };

  const changeExerciseNameInput = (exerciseIndex: number, value: string) => {
    const exerciseNameInput = nameInputElement(
      exerciseElements()[exerciseIndex],
    );
    exerciseNameInput.value = value;
    exerciseNameInput.dispatchEvent(new Event('input'));
  };

  const changeDateInput = (date: Date | null) => {
    // changing input in the template didn't work
    const formControl = component.form.get('date');
    formControl?.setValue(date);
  };
});
