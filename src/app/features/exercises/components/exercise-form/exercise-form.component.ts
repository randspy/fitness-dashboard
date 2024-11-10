import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { InputComponent } from '../../../../ui/components/input/input.component';
import { ButtonComponent } from '../../../../ui/components/button/button.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { TextareaComponent } from '../../../../ui/components/textarea/textarea.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Exercise, initialExercise } from '../../domain/exercise.model';

@Component({
  selector: 'fit-exercise-form',
  standalone: true,
  imports: [
    InputComponent,
    TextareaComponent,
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './exercise-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseFormComponent {
  confirmationService = inject(ConfirmationService);
  initialState = input<Exercise>(initialExercise);
  save = output<Exercise>();
  cancel = output<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [this.initialState().name, [Validators.required]],
      description: [this.initialState().description],
    });

    effect(
      () => {
        this.form.patchValue(
          {
            name: this.initialState().name,
            description: this.initialState().description,
          },
          { emitEvent: false },
        );
      },
      { allowSignalWrites: true },
    );
  }

  onSubmit() {
    if (this.form.valid) {
      const exercise: Exercise = {
        id: this.initialState().id,
        name: this.form.value.name,
        description: this.form.value.description,
      };
      this.save.emit(exercise);
      this.form.reset();
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  get isNameInvalid(): boolean {
    return !!(this.form.get('name')?.invalid && this.form.get('name')?.touched);
  }

  canDeactivate(): boolean {
    return !(this.form.dirty && this.hasFormChanged());
  }

  hasFormChanged(): boolean {
    return (
      this.form.value.name !== this.initialState().name ||
      this.form.value.description !== this.initialState().description
    );
  }
}
