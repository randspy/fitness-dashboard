import {
  signal,
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  OnInit,
  input,
  computed,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { deepEqual } from 'fast-equals';
import { DatepickerComponent } from '../../../../ui/components/datepicker/datepicker.component';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { ButtonComponent } from '../../../../ui/components/button/button.component';
import { InputComponent } from '../../../../ui/components/input/input.component';
import { Session } from '../../../../core/sessions/domain/session.types';
import { ExerciseStore } from '../../../../core/exercises/store/exercise.store';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SelectComponent } from '../../../../ui/components/select/select.component';
import { CanComponentDeactivate } from '../../../../core/shared/domain/can-component-deactivate.types';

@Component({
  selector: 'fit-session-form',
  standalone: true,
  imports: [
    CardComponent,
    ReactiveFormsModule,
    DatepickerComponent,
    ButtonComponent,
    InputComponent,
    FormsModule,
    AutocompleteLibModule,
    SelectComponent,
  ],
  templateUrl: './session-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionFormComponent implements OnInit, CanComponentDeactivate {
  formBuilder = inject(FormBuilder);
  exerciseStore = inject(ExerciseStore);

  header = input<string>('');
  session = input<Session | undefined>();
  save = output<Session>();
  cancel = output<void>();

  notModifiedFormValue = signal<Session | undefined>(undefined);

  form = this.formBuilder.group({
    id: [crypto.randomUUID() as string],
    name: ['', Validators.required],
    date: [new Date(new Date().setHours(0, 0, 0, 0)), Validators.required],
    exercises: this.formBuilder.array([this.generateExercise()]),
  });

  ngOnInit() {
    const session = this.session();
    if (session) {
      this.rebuildForm(session);
    }

    this.notModifiedFormValue.set(
      session ? session : (this.form.value as Session),
    );
  }

  private rebuildForm(session: Session) {
    (this.form.get('exercises') as FormArray).clear();

    session.exercises.forEach((exercise) => {
      const exerciseGroup = this.formBuilder.group({
        id: [exercise.id],
        exerciseId: [exercise.exerciseId, Validators.required],
        sets: this.formBuilder.array([]),
      });

      const setsArray = exerciseGroup.get('sets') as FormArray;
      exercise.sets.forEach((set) => {
        setsArray.push(
          this.formBuilder.group({
            id: [set.id],
            repetitions: [
              set.repetitions,
              [Validators.required, Validators.min(1)],
            ],
            weight: [set.weight, [Validators.required, Validators.min(0)]],
          }),
        );
      });

      (this.form.get('exercises') as FormArray).push(exerciseGroup);
    });

    this.form.patchValue({
      id: session.id,
      name: session.name,
      date: new Date(session.date),
    });
  }

  generateExercise() {
    return this.formBuilder.group({
      id: [crypto.randomUUID() as string],
      exerciseId: ['', Validators.required],
      sets: this.formBuilder.array([this.generateSet()]),
    });
  }

  generateSet() {
    return this.formBuilder.group({
      id: [crypto.randomUUID() as string],
      repetitions: [1, [Validators.required, Validators.min(1)]],
      weight: [0, [Validators.required, Validators.min(0)]],
    });
  }

  get exercises() {
    return this.form.get('exercises') as FormArray;
  }

  removeExercise(index: number) {
    this.exercises.removeAt(index);
  }

  getSets(index: number) {
    return this.exercises.controls[index].get('sets') as FormArray;
  }

  isDateInvalid(): boolean {
    const dateControl = this.form.get('date')!;
    return dateControl.invalid && dateControl.touched;
  }

  isSessionNameInvalid(): boolean {
    const nameControl = this.form.get('name')!;
    return nameControl.invalid && nameControl.touched;
  }

  isExerciseIdInvalid(index: number): boolean {
    const nameControl = this.exercises.at(index).get('exerciseId')!;
    return nameControl.invalid && nameControl.touched;
  }

  isSetInvalid(
    exerciseIndex: number,
    setIndex: number,
    field: 'repetitions' | 'weight',
  ): boolean {
    const control = this.getSets(exerciseIndex).at(setIndex).get(field)!;
    return control.invalid && control.touched;
  }

  getSetErrorMessage(
    exerciseIndex: number,
    setIndex: number,
    field: 'repetitions' | 'weight',
  ): string {
    const control = this.getSets(exerciseIndex).at(setIndex).get(field)!;
    if (control.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control.hasError('min')) {
      return field === 'repetitions'
        ? 'Repetitions must be at least 1'
        : 'Weight must be at least 0';
    }
    return '';
  }

  addExercise() {
    const items = this.exercises;
    items.push(this.generateExercise());
  }

  addSet(index: number) {
    const sets = this.getSets(index);
    sets.push(this.generateSet());
  }

  removeSet(exerciseIndex: number, setIndex: number) {
    const sets = this.getSets(exerciseIndex);
    sets.removeAt(setIndex);
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(
        this.convertFormValueToSession(this.form.value as Session),
      );
      // without clearing the exercises array the unit tests will contain
      // unnecessary error logs for key tracking of list items in the template
      (this.form.get('exercises') as FormArray).clear();
      this.form.reset();
    } else {
      this.form.markAllAsTouched();
    }
  }

  convertFormValueToSession(formValue: Session): Session {
    formValue.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        set.weight = Number(set.weight);
        set.repetitions = Number(set.repetitions);
      });
    });
    return formValue;
  }

  onCancel() {
    this.cancel.emit();
  }

  canDeactivate(): boolean {
    return !(this.form.dirty && this.hasFormChanged());
  }

  hasFormChanged(): boolean {
    return !deepEqual(this.notModifiedFormValue(), this.form.value);
  }

  exerciseSuggestions = computed(() =>
    this.exerciseStore
      .exercises()
      .filter(
        (exercise) =>
          !exercise.hidden ||
          this.session()?.exercises.some((e) => e.exerciseId === exercise.id),
      ),
  );
}
