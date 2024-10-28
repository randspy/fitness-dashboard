import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserStore } from './user.store';
import { userSetupCompletedGuard, userSetupRequiredGuard } from './user.guards';

describe('User Guards', () => {
  let router: jest.Mocked<Router>;
  let userStore: InstanceType<typeof UserStore>;

  beforeEach(() => {
    router = {
      navigate: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [UserStore, { provide: Router, useValue: router }],
    });

    userStore = TestBed.inject(UserStore);
  });

  describe('userSetupCompletedGuard', () => {
    it('should redirect to welcome page when user does not exist', () => {
      userStore.setName('');

      TestBed.runInInjectionContext(userSetupCompletedGuard);

      expect(router.navigate).toHaveBeenCalledWith(['/welcome']);
    });

    it('should allow navigation when user exists', () => {
      userStore.setName('John');

      const result = TestBed.runInInjectionContext(userSetupCompletedGuard);

      expect(router.navigate).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('userSetupRequiredGuard', () => {
    it('should redirect to dashboard when user exists', () => {
      userStore.setName('John');

      TestBed.runInInjectionContext(userSetupRequiredGuard);

      expect(router.navigate).toHaveBeenCalledWith(['/app/dashboard']);
    });

    it('should allow navigation when user does not exist', () => {
      userStore.setName('');

      const result = TestBed.runInInjectionContext(userSetupRequiredGuard);

      expect(router.navigate).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
