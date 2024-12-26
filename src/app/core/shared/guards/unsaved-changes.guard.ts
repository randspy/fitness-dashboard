import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from '../domain/can-component-deactivate.types';

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
) => (component.canDeactivate ? component.canDeactivate() : true);
