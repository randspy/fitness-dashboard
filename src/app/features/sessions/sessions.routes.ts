import { Routes } from '@angular/router';
import { SessionPageComponent } from './components/session-page/session-page.component';
import { NewSessionPageComponent } from './components/new-session-page/new-session-page.component';
import { unsavedChangesGuard } from '../../core/shared/guards/unsaved-changes.guard';
import { EditSessionPageComponent } from './components/edit-session-page/edit-session-page.component';
import { sessionExistsGuard } from './guards/session-exists.guard';
import { SessionStoreService } from '../../core/sessions/service/session-store.service';

export const sessionsRoutes: Routes = [
  {
    path: '',
    providers: [SessionStoreService],
    children: [
      {
        path: '',
        component: SessionPageComponent,
      },
      {
        path: 'new',
        component: NewSessionPageComponent,
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: ':id',
        component: EditSessionPageComponent,
        canMatch: [sessionExistsGuard],
        canDeactivate: [unsavedChangesGuard],
      },
    ],
  },
];
