import { TestBed } from '@angular/core/testing';
import {
  CanDeactivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import {
  CanComponentDeactivate,
  unsavedChangesGuardGuard,
} from './unsaved-changes-guard.guard';

describe('unsavedChangesGuardGuard', () => {
  const currentRoute = {} as ActivatedRouteSnapshot;
  const currentState = {} as RouterStateSnapshot;
  const nextState = {} as RouterStateSnapshot;

  const executeGuard: CanDeactivateFn<CanComponentDeactivate> = (component) =>
    TestBed.runInInjectionContext(() =>
      unsavedChangesGuardGuard(
        component,
        currentRoute,
        currentState,
        nextState,
      ),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if component does not implement CanComponentDeactivate', () => {
    const component = {
      canDeactivate: undefined,
    };

    expect(executeGuard(component, currentRoute, currentState, nextState)).toBe(
      true,
    );
  });

  it('should return false if component implements CanComponentDeactivate and returns false', () => {
    const component = {
      canDeactivate: () => false,
    };

    expect(executeGuard(component, currentRoute, currentState, nextState)).toBe(
      false,
    );
  });

  it('should return true if component implements CanComponentDeactivate and returns true', () => {
    const component = {
      canDeactivate: () => true,
    };

    expect(executeGuard(component, currentRoute, currentState, nextState)).toBe(
      true,
    );
  });
});