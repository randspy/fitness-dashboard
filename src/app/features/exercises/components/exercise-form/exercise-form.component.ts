import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { InputComponent } from '../../../../ui/components/input/input.component';
import { ButtonComponent } from '../../../../ui/components/button/button.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { TextareaComponent } from '../../../../ui/components/textarea/textarea.component';
import { ExerciseForm } from '../../../../core/exercises/domain/exercise.types';
import { deepEqual } from 'fast-equals';
import { CanComponentDeactivate } from '../../../../core/shared/domain/can-component-deactivate.types';

@Component({
  selector: 'fit-exercise-form',
  standalone: true,
  imports: [
    InputComponent,
    TextareaComponent,
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
  ],

  templateUrl: './exercise-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseFormComponent implements OnInit, CanComponentDeactivate {
  formBuilder = inject(FormBuilder);

  header = input<string>('');
  exercise = input<ExerciseForm | undefined>();
  save = output<ExerciseForm>();
  cancel = output<void>();

  notModifiedFormValue = signal<ExerciseForm | undefined>(undefined);

  form = this.formBuilder.group({
    id: [crypto.randomUUID() as string],
    name: ['', [Validators.required]],
    description: [''],
  });

  ngOnInit() {
    const exercise = this.exercise();
    if (exercise) {
      this.form.patchValue(exercise);
    }

    this.notModifiedFormValue.set(
      exercise ? exercise : (this.form.value as ExerciseForm),
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value as ExerciseForm);
      this.form.reset();
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  get isNameInvalid(): boolean {
    const nameControl = this.form.get('name')!;
    return nameControl.invalid && nameControl.touched;
  }

  canDeactivate(): boolean {
    return !(this.form.dirty && this.hasFormChanged());
  }

  hasFormChanged(): boolean {
    return !deepEqual(this.notModifiedFormValue(), this.form.value);
  }
}
