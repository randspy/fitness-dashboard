import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { InputComponent } from '../../../../ui/components/input/input.component';
import { ButtonComponent } from '../../../../ui/components/button/button.component';
import { UserStore } from '../../../../core/user/store/user.store';
import { Router } from '@angular/router';
import { DefaultRoute } from '../../../../core/shared/domain/routes.config';

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
  private router = inject(Router);
  private userStore = inject(UserStore);
  private fb = inject(FormBuilder);

  welcomeForm = this.fb.group({
    name: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.welcomeForm.valid) {
      this.userStore.setName(this.welcomeForm.value.name!);
      this.router.navigate([DefaultRoute]);
    } else {
      this.welcomeForm.markAllAsTouched();
    }
  }

  get isNameInvalid(): boolean {
    const nameControl = this.welcomeForm.get('name')!;
    return nameControl.invalid && nameControl.touched;
  }
}
