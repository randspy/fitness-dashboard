import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';

import { SessionListComponent } from './session-list.component';
import { By } from '@angular/platform-browser';
import { Session } from '../../domain/session.model';
import { DatePipe } from '@angular/common';
import { generateSession } from '../../../../../../setup-jest';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SessionStore } from '../../store/sessions.store';
import { Subject } from 'rxjs';
import { provideRouter } from '@angular/router';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { LinkComponentHarness } from '../../../../../tests/harness/ui/link.harness';
import { ButtonComponentHarness } from '../../../../../tests/harness/ui/button.harness';

describe('SessionListComponent', () => {
  let fixture: ComponentFixture<SessionListComponent>;
  let confirmationService: ConfirmationService;
  let sessionStore: InstanceType<typeof SessionStore>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    const mockConfirmationService = {
      requireConfirmation$: new Subject(),
      confirm: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SessionListComponent, NoopAnimationsModule],
      providers: [provideRouter([])],
    })
      .overrideProvider(ConfirmationService, {
        useValue: mockConfirmationService,
      })
      .compileComponents();

    sessionStore = TestBed.inject(SessionStore);
    fixture = TestBed.createComponent(SessionListComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    confirmationService =
      fixture.debugElement.injector.get(ConfirmationService);

    fixture.componentRef.setInput('sessions', []);
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStore.reset();
    localStorage.clear();
  });

  it('should display empty state when no sessions', () => {
    const emptyState = fixture.debugElement.query(
      By.css('[data-testid="empty-state"]'),
    );
    expect(emptyState).toBeTruthy();
    expect(emptyState.nativeElement.textContent).toBe('No sessions');
  });

  it('should display sessions when available', () => {
    const session: Session = generateSession({
      id: '1',
    });

    fixture.componentRef.setInput('sessions', [session]);
    fixture.detectChanges();

    const sessionElements = sessionsQuery();

    expect(sessionElements.length).toBe(1);
    expect(sessionElements[0].nativeElement.textContent).toContain(
      session.name,
    );
    expect(sessionElements[0].nativeElement.textContent).toContain(
      new DatePipe('en-US').transform(session.date),
    );
  });

  it('should display sessions in descending order', () => {
    const session1: Session = generateSession({
      id: '1',
    });
    const session2: Session = generateSession({
      id: '2',
    });

    fixture.componentRef.setInput('sessions', [session1, session2]);
    fixture.detectChanges();

    const sessionElements = sessionsQuery();

    expect(sessionElements.length).toBe(2);
    expect(sessionElements[0].nativeElement.textContent).toContain(
      session2.name,
    );
    expect(sessionElements[1].nativeElement.textContent).toContain(
      session1.name,
    );
  });

  it('should display the delete modal', async () => {
    const session: Session = generateSession({
      id: '1',
    });

    sessionStore.setSessions([session]);
    fixture.componentRef.setInput('sessions', [session]);
    fixture.componentRef.setInput('displayActions', true);
    fixture.detectChanges();

    await clickDeleteButton();

    expect(confirmationService.confirm).toHaveBeenCalled();
  });

  it('should remove session when confirmed', async () => {
    const session: Session = generateSession({
      id: '1',
    });

    sessionStore.setSessions([session]);
    fixture.componentRef.setInput('sessions', [session]);
    fixture.componentRef.setInput('displayActions', true);
    fixture.detectChanges();

    await clickDeleteButton();

    const confirmArgs = (confirmationService.confirm as jest.Mock).mock
      .calls[0][0];
    confirmArgs.accept();

    expect(sessionStore.sessions()).toEqual([]);
  });

  it('should navigate to the session page when a session is clicked', async () => {
    const session: Session = generateSession({
      id: '1',
    });
    sessionStore.setSessions([session]);
    fixture.componentRef.setInput('sessions', [session]);
    fixture.componentRef.setInput('displayActions', true);
    fixture.detectChanges();

    const link = await loader.getHarness(LinkComponentHarness);
    expect(link).toBeTruthy();
    expect(await link.getLink()).toBe('1');
  });

  const sessionsQuery = () =>
    fixture.debugElement.queryAll(By.css('[data-testid="session-item"]'));

  const clickDeleteButton = async () => {
    const deleteButton = await loader.getHarness(
      ButtonComponentHarness.with({
        testId: 'delete-button',
      }),
    );
    await deleteButton.click();
  };
});
