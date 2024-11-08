import {
  signal,
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { isEqual } from 'lodash';
import { DatepickerComponent } from '../../../../ui/components/datepicker/datepicker.component';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { ButtonComponent } from '../../../../ui/components/button/button.component';
import { InputComponent } from '../../../../ui/components/input/input.component';
import { Session } from '../../domain/session.model';
import { markFormAsTouched } from '../../../../core/shared/mark-as-touched';

@Component({
  selector: 'fit-session-form',
  standalone: true,
  imports: [
    CardComponent,
    ReactiveFormsModule,
    DatepickerComponent,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './session-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionFormComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  save = output<Session>();
  cancel = output<void>();
  initialFormValue = signal<Session | null>(null);

  form = this.formBuilder.group({
    id: [crypto.randomUUID(), { nonNullable: true }],
    date: [new Date(), Validators.required],
    exercises: this.formBuilder.array([this.generateExercise()]),
  });

  ngOnInit() {
    this.initialFormValue.set(this.form.value as Session);
  }

  generateExercise() {
    return this.formBuilder.group({
      id: [crypto.randomUUID()],
      name: ['', Validators.required],
      sets: this.formBuilder.array([this.generateSet()]),
    });
  }

  generateSet() {
    return this.formBuilder.group({
      id: [crypto.randomUUID()],
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
    const dateControl = this.form.get('date');
    return !!(dateControl?.invalid && dateControl?.touched);
  }

  isExerciseNameInvalid(index: number): boolean {
    const nameControl = this.exercises.at(index).get('name');
    return !!(nameControl?.invalid && nameControl?.touched);
  }

  isSetInvalid(
    exerciseIndex: number,
    setIndex: number,
    field: 'repetitions' | 'weight',
  ): boolean {
    const control = this.getSets(exerciseIndex).at(setIndex).get(field);
    return !!(control?.invalid && control?.touched);
  }

  getSetErrorMessage(
    exerciseIndex: number,
    setIndex: number,
    field: 'repetitions' | 'weight',
  ): string {
    const control = this.getSets(exerciseIndex).at(setIndex).get(field);
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control?.hasError('min')) {
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
      this.save.emit(this.form.value as Session);
      this.form.reset();
    } else {
      markFormAsTouched(this.form);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  canDeactivate(): boolean {
    return !(this.form.dirty && this.hasFormChanged());
  }

  hasFormChanged(): boolean {
    return !isEqual(this.initialFormValue(), this.form.value);
  }
}
