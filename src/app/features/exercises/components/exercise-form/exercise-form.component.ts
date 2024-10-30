import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InputComponent } from '../../../../ui/components/input/input.component';
import { ButtonComponent } from '../../../../ui/components/button/button.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { TextareaComponent } from '../../../../ui/components/textarea/textarea.component';

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
export class ExerciseFormComponent {
  form: FormGroup;
  router = inject(Router);
  route = inject(ActivatedRoute);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  get isNameInvalid(): boolean {
    return !!(
      this.form.get('name')?.invalid &&
      this.form.get('name')?.touched &&
      this.form.get('name')?.dirty
    );
  }
}
