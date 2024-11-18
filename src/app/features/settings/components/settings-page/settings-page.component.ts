import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageSkeletonComponent } from '../../../../ui/components/page-skeleton/page-skeleton.component';
import { UserStore } from '../../../../core/user/store/user.store';
import { InputComponent } from '../../../../ui/components/input/input.component';
import {
  FormsModule,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonComponent } from '../../../../ui/components/button/button.component';
import { CardComponent } from '../../../../ui/components/card/card.component';

@Component({
  selector: 'fit-settings-page',
  standalone: true,
  imports: [
    PageSkeletonComponent,
    InputComponent,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
  ],
  templateUrl: './settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        @apply flex flex-grow flex-col;
      }
    `,
  ],
})
export class SettingsPageComponent {
  userStore = inject(UserStore);
  fb = inject(FormBuilder);

  form = this.fb.group({
    name: [this.userStore.name(), [Validators.required]],
  });

  onSubmit() {
    if (this.form.valid) {
      this.userStore.setName(this.form.value.name!);
    } else {
      this.form.markAllAsTouched();
    }
  }

  get isNameInvalid(): boolean {
    const nameControl = this.form.get('name')!;
    return nameControl.invalid && nameControl.touched;
  }
}
