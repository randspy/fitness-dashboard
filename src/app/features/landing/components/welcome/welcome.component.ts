import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { InputComponent } from '../../../../ui/components/input/input.component';
import { ButtonComponent } from '../../../../ui/components/button/button.component';
import { UserStore } from '../../../../core/user/user.store';
import { Router } from '@angular/router';

@Component({
  selector: 'fit-welcome',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './welcome.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent {
  welcomeForm: FormGroup;

  router = inject(Router);
  userStore = inject(UserStore);

  constructor(private fb: FormBuilder) {
    this.welcomeForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.welcomeForm.valid) {
      this.userStore.setName(this.welcomeForm.value.name);
      this.router.navigate(['/dashboard']);
    }
  }

  get isNameInvalid(): boolean {
    return !!(
      this.welcomeForm.get('name')?.invalid &&
      this.welcomeForm.get('name')?.touched &&
      this.welcomeForm.get('name')?.dirty
    );
  }

  get nameErrorMessage(): string {
    return this.welcomeForm.get('name')?.hasError('required')
      ? 'Name is required'
      : '';
  }
}
