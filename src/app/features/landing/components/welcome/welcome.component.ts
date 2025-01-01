import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { InputComponent } from '../../../../ui/components/input/input.component';
import { ButtonComponent } from '../../../../ui/components/button/button.component';
import { UserStore } from '../../../../core/user/store/user.store';
import { Router } from '@angular/router';
import { DefaultRoute } from '../../../../core/shared/domain/routes.config';
import { InitialAppStateService } from '../../services/initial-app-state.service';

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
  // required for injecting initial app state into the local storage when leaving the welcome page
  // don't remove it if you want to keep this functionality
  private initialAppStateService = inject(InitialAppStateService);

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
