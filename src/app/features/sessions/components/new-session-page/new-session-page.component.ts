import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { SessionFormComponent } from '../session-form/session-form.component';
import { Session } from '../../../../core/sessions/domain/session.types';
import { BaseFormPageComponent } from '../../../../core/shared/components/base-form-page/base-form-page.component';
import { SessionStoreService } from '../../service/session-store.service';
import { ConfirmationDialogService } from '../../../../ui/services/confirmation-dialog.service';

@Component({
  selector: 'fit-new-session-page',
  standalone: true,
  imports: [SessionFormComponent],
  templateUrl: './new-session-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationDialogService],
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
  sessionStoreService = inject(SessionStoreService);

  onSubmit(session: Session) {
    this.sessionStoreService.addSession(session);
    this.navigateToParent();
  }

  onCancel() {
    this.navigateToParent();
  }
}
