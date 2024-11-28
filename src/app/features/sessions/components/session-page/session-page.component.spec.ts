import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionPageComponent } from './session-page.component';
import { provideRouter } from '@angular/router';
import { SessionStore } from '../../../../core/sessions/store/sessions.store';
import { Session } from '../../../../core/sessions/domain/session.types';
import { By } from '@angular/platform-browser';
import { SessionListComponent } from '../../../../core/sessions/components/session-list/session-list.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { LinkComponentHarness } from '../../../../../tests/harness/ui/link.harness';
import { SessionStoreService } from '../../service/session-store.service';
import { SessionListActionsComponent } from '../session-list-actions/session-list-actions.component';
import { generateSession } from '../../../../../tests/test-object-generators';
import { provideTestServices } from '../../../../../tests/test-providers';

describe('SessionPageComponent', () => {
  let component: SessionPageComponent;
  let fixture: ComponentFixture<SessionPageComponent>;
  let sessionStore: InstanceType<typeof SessionStore>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionPageComponent],
      providers: [
        provideRouter([]),
        ...provideTestServices(),
        SessionStoreService,
      ],
    }).compileComponents();

    sessionStore = TestBed.inject(SessionStore);
    fixture = TestBed.createComponent(SessionPageComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStore.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a link to the new session page', async () => {
    const link = await loader.getHarness(LinkComponentHarness);
    expect(link).toBeTruthy();
    expect(await link.getLink()).toBe('/new');
  });

  it('should have a exercise list', () => {
    const sessionList = fixture.nativeElement.querySelector('fit-session-list');
    expect(sessionList).toBeTruthy();
  });

  it('should forward sessions to the session list', () => {
    const session = generateSession({ id: '1' });
    sessionStore.setSessions([session]);
    fixture.detectChanges();

    const sessionList = fixture.debugElement.query(
      By.directive(SessionListComponent),
    );
    expect(sessionList.componentInstance.sessions()).toEqual([session]);
  });

  it("should display session's list actions", () => {
    const session: Session = generateSession({
      id: '1',
    });

    sessionStore.setSessions([session]);
    fixture.detectChanges();

    const sessionListActions = fixture.debugElement.query(
      By.directive(SessionListActionsComponent),
    );
    expect(sessionListActions.componentInstance.id()).toBe('1');
  });
});
