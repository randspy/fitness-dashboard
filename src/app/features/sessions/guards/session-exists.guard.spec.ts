import { TestBed } from '@angular/core/testing';
import { Route, Router, UrlSegment } from '@angular/router';
import { generateSession } from '../../../../tests/test-object-generators';
import { SessionStore } from '../../../core/sessions/store/sessions.store';
import { sessionExistsGuard } from './session-exists.guard';
import { provideTestServices } from '../../../../tests/test-providers';

describe('sessionExistsGuard', () => {
  let sessionStore: InstanceType<typeof SessionStore>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionStore,
        ...provideTestServices(),
        {
          provide: Router,
          useValue: {
            navigate: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    });

    sessionStore = TestBed.inject(SessionStore);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStore.reset();
  });

  it('should allow navigation when session exists', () => {
    const testSession = generateSession({ id: '123' });
    sessionStore.addSession(testSession);

    const result = TestBed.runInInjectionContext(() =>
      sessionExistsGuard({} as Route, [{ path: '123' } as UrlSegment]),
    );

    expect(result).toBe(true);
  });

  it('should redirect to page not found when session does not exist', () => {
    TestBed.runInInjectionContext(() =>
      sessionExistsGuard({} as Route, [{ path: '123' } as UrlSegment]),
    );

    expect(router.navigate).toHaveBeenCalledWith(['/page-not-found']);
  });

  it('should redirect to page not found when path does not exist', () => {
    const testSession = generateSession({ id: '123' });
    sessionStore.addSession(testSession);

    TestBed.runInInjectionContext(() => sessionExistsGuard({} as Route, []));

    expect(router.navigate).toHaveBeenCalledWith(['/page-not-found']);
  });
});
