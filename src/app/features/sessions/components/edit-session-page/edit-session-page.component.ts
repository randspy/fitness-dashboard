import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { SessionFormComponent } from '../session-form/session-form.component';
import { Session } from '../../../../core/sessions/domain/session.types';
import { SessionStore } from '../../../../core/sessions/store/sessions.store';
import { BaseFormPageComponent } from '../../../../core/shared/components/base-form-page/base-form-page.component';
import { SessionStoreService } from '../../service/session-store.service';
import { ConfirmationDialogService } from '../../../../ui/services/confirmation-dialog.service';
import { ConfirmationDialogComponent } from '../../../../ui/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'fit-edit-session-page',
  standalone: true,
  imports: [SessionFormComponent, ConfirmationDialogComponent],
  providers: [ConfirmationDialogService],
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
  sessionStoreService = inject(SessionStoreService);

  session = computed(() => {
    return this.sessionStore.getSessionById(this.id());
  });

  onSubmit(session: Session) {
    this.sessionStoreService.updateSession(this.id() as string, session);
    this.navigateToParent();
  }

  onCancel() {
    this.navigateToParent();
  }
}
