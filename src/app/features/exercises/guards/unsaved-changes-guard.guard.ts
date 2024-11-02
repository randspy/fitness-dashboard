import { CanDeactivateFn } from '@angular/router';

import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate?: () => Observable<boolean> | Promise<boolean> | boolean;
}

export const unsavedChangesGuardGuard: CanDeactivateFn<
  CanComponentDeactivate
> = (component) => (component.canDeactivate ? component.canDeactivate() : true);
