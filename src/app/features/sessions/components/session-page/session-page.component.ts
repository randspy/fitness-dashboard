import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LinkComponent } from '../../../../ui/components/link/link.component';
import { SessionListComponent } from '../session-list/session-list.component';

@Component({
  selector: 'fit-session-page',
  standalone: true,
  imports: [LinkComponent, SessionListComponent],
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
export class SessionPageComponent {}
