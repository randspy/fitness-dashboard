import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionListActionsComponent } from './session-list-actions.component';
import { SessionStoreService } from '../../service/session-store.service';
import { provideRouter } from '@angular/router';
import { ButtonComponentHarness } from '../../../../../tests/harness/ui/button.harness';
import { LinkComponentHarness } from '../../../../../tests/harness/ui/link.harness';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideTestServices } from '../../../../../tests/test-providers';
import { applyConfirmationDialogOverrides } from '../../../../../tests/apply-confirmation-dialog-overrides';
import { mockConfirmationDialogService } from '../../../../../tests/mock-confirmation-dialog-service';

describe('SessionListActionsComponent', () => {
  let fixture: ComponentFixture<SessionListActionsComponent>;
  let sessionStoreService: SessionStoreService;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await applyConfirmationDialogOverrides(TestBed)
      .configureTestingModule({
        imports: [SessionListActionsComponent],
        providers: [
          SessionStoreService,
          provideRouter([]),
          ...provideTestServices(),
        ],
      })
      .compileComponents();

    sessionStoreService = TestBed.inject(SessionStoreService);
    fixture = TestBed.createComponent(SessionListActionsComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.componentRef.setInput('id', 'session-1');
    fixture.componentRef.setInput('name', 'Test Session');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the delete modal', async () => {
    await clickDeleteButton();

    expect(
      (mockConfirmationDialogService.show as jest.Mock).mock.calls[0][0],
    ).toEqual({
      header: 'Delete session',
      message: 'Are you sure you want to delete this session?',
      accept: expect.any(Function),
    });
  });

  it('should remove session when confirmed', async () => {
    const removeSessionSpy = jest.spyOn(sessionStoreService, 'removeSession');

    await clickDeleteButton();

    const confirmArgs = (mockConfirmationDialogService.show as jest.Mock).mock
      .calls[0][0];
    confirmArgs.accept();

    expect(removeSessionSpy).toHaveBeenCalledWith('session-1');
  });

  it('should navigate to the session page when a session is clicked', async () => {
    const link = await loader.getHarness(LinkComponentHarness);
    expect(link).toBeTruthy();
    expect(await link.getLink()).toBe('/session-1');
  });

  const clickDeleteButton = async () => {
    const deleteButton = await loader.getHarness(
      ButtonComponentHarness.with({
        testId: 'delete-button',
      }),
    );
    await deleteButton.click();
  };

  it('should have aria-label attribute form edit button', async () => {
    const link = await loader.getHarness(LinkComponentHarness);
    expect(await link.getAriaLabel()).toBe('Edit Test Session session');
  });

  it('should have aria-label attribute form delete button', async () => {
    const deleteButton = await loader.getHarness(ButtonComponentHarness);
    expect(await deleteButton.getAriaLabel()).toBe(
      'Delete Test Session session',
    );
  });
});
