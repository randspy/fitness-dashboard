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
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Exercise } from '../../domain/exercise.model';
import { isEqual } from 'lodash';

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
export class ExerciseFormComponent implements OnInit {
  confirmationService = inject(ConfirmationService);
  formBuilder = inject(FormBuilder);

  header = input<string>('');
  exercise = input<Exercise | undefined>();
  save = output<Exercise>();
  cancel = output<void>();

  notModifiedFormValue = signal<Exercise | undefined>(undefined);

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
      exercise ? exercise : (this.form.value as Exercise),
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value as Exercise);
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
    return !isEqual(this.notModifiedFormValue(), this.form.value);
  }
}
