import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SessionFormComponent } from '../session-form/session-form.component';
import { Session } from '../../../../core/sessions/domain/session.model';
import { ConfirmationService } from 'primeng/api';
import { SessionStore } from '../../../../core/sessions/store/sessions.store';
import { BaseFormPageComponent } from '../../../../core/shared/components/base-form-page/base-form-page.component';

@Component({
  selector: 'fit-edit-session-page',
  standalone: true,
  imports: [ConfirmDialogModule, SessionFormComponent],
  providers: [ConfirmationService],
  templateUrl: './edit-session-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        @apply flex-grow;
      }
    `,
  ],
})
export class EditSessionPageComponent extends BaseFormPageComponent<SessionFormComponent> {
  child = viewChild.required<SessionFormComponent>(SessionFormComponent);
  id = input.required<string>();
  sessionStore = inject(SessionStore);

  session = computed(() => {
    return this.sessionStore.getSessionById(this.id());
  });

  onSubmit(session: Session) {
    this.sessionStore.updateSession(this.id() as string, session);
    this.navigateToParent();
  }

  onCancel() {
    this.navigateToParent();
  }
}