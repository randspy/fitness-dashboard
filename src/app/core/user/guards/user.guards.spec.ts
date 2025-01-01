import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserStore } from '../store/user.store';
import { userSetupCompletedGuard, userSetupRequiredGuard } from './user.guards';
import { provideTestServices } from '../../../../tests/test-providers';
import { DefaultRoute, WelcomeRoute } from '../../shared/domain/routes.config';

describe('User Guards', () => {
  let router: jest.Mocked<Router>;
  let userStore: InstanceType<typeof UserStore>;

  beforeEach(() => {
    router = {
      navigate: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        UserStore,
        { provide: Router, useValue: router },
        ...provideTestServices(),
      ],
    });

    userStore = TestBed.inject(UserStore);
  });

  describe('userSetupCompletedGuard', () => {
    it('should redirect to welcome page when user does not exist', () => {
      userStore.setName('');

      TestBed.runInInjectionContext(userSetupCompletedGuard);

      expect(router.navigate).toHaveBeenCalledWith([WelcomeRoute]);
    });

    it('should allow navigation when user exists', () => {
      userStore.setName('John');

      const result = TestBed.runInInjectionContext(userSetupCompletedGuard);

      expect(router.navigate).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('userSetupRequiredGuard', () => {
    it('should redirect to default route when user exists', () => {
      userStore.setName('John');

      TestBed.runInInjectionContext(userSetupRequiredGuard);

      expect(router.navigate).toHaveBeenCalledWith([DefaultRoute]);
    });

    it('should allow navigation when user does not exist', () => {
      userStore.setName('');

      const result = TestBed.runInInjectionContext(userSetupRequiredGuard);

      expect(router.navigate).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
