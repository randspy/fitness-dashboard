import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LinkComponent } from '../../../../ui/components/link/link.component';
import { SessionListComponent } from '../../../../core/sessions/components/session-list/session-list.component';
import { SessionStore } from '../../../../core/sessions/store/sessions.store';
import { PageSkeletonComponent } from '../../../../ui/components/page-skeleton/page-skeleton.component';

@Component({
  selector: 'fit-session-page',
  standalone: true,
  imports: [LinkComponent, SessionListComponent, PageSkeletonComponent],
  templateUrl: './session-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        @apply flex flex-grow flex-col;
      }
    `,
  ],
})
export class SessionPageComponent {
  sessionStore = inject(SessionStore);
}
