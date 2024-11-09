import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { SessionFormComponent } from '../session-form/session-form.component';
import { SessionStore } from '../../../../core/sessions/store/sessions.store';
import { Session } from '../../../../core/sessions/domain/session.model';
import { BaseFormPageComponent } from '../../../../core/shared/components/base-form-page/base-form-page.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'fit-new-session-page',
  standalone: true,
  imports: [SessionFormComponent, ConfirmDialogModule],
  templateUrl: './new-session-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
  styles: [
    `
      :host {
        @apply flex-grow;
      }
    `,
  ],
})
export class NewSessionPageComponent extends BaseFormPageComponent<SessionFormComponent> {
  child = viewChild.required<SessionFormComponent>(SessionFormComponent);
  sessionStore = inject(SessionStore);

  onSubmit(session: Session) {
    this.sessionStore.addSession(session);
    this.navigateToParent();
  }

  onCancel() {
    this.navigateToParent();
  }
}
