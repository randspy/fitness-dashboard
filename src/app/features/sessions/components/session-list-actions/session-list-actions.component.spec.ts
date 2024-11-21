import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionListActionsComponent } from './session-list-actions.component';
import { SessionStoreService } from '../../service/session-store.service';
import { provideRouter } from '@angular/router';
import { ButtonComponentHarness } from '../../../../../tests/harness/ui/button.harness';
import { LinkComponentHarness } from '../../../../../tests/harness/ui/link.harness';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';

describe('SessionListActionsComponent', () => {
  let fixture: ComponentFixture<SessionListActionsComponent>;
  let confirmationService: ConfirmationService;
  let sessionStoreService: SessionStoreService;
  let loader: HarnessLoader;

  beforeEach(async () => {
    const mockConfirmationService = {
      requireConfirmation$: new Subject(),
      confirm: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SessionListActionsComponent],
      providers: [SessionStoreService, provideRouter([])],
    })
      .overrideProvider(ConfirmationService, {
        useValue: mockConfirmationService,
      })
      .compileComponents();

    sessionStoreService = TestBed.inject(SessionStoreService);
    confirmationService = TestBed.inject(ConfirmationService);
    fixture = TestBed.createComponent(SessionListActionsComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.componentRef.setInput('id', 'session-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the delete modal', async () => {
    await clickDeleteButton();

    expect(confirmationService.confirm).toHaveBeenCalled();
  });

  it('should remove session when confirmed', async () => {
    const removeSessionSpy = jest.spyOn(sessionStoreService, 'removeSession');

    await clickDeleteButton();

    const confirmArgs = (confirmationService.confirm as jest.Mock).mock
      .calls[0][0];
    confirmArgs.accept();

    expect(removeSessionSpy).toHaveBeenCalledWith('session-1');
  });

  it('should navigate to the session page when a session is clicked', async () => {
    const link = await loader.getHarness(LinkComponentHarness);
    expect(link).toBeTruthy();
    expect(await link.getLink()).toBe('session-1');
  });

  const clickDeleteButton = async () => {
    const deleteButton = await loader.getHarness(
      ButtonComponentHarness.with({
        testId: 'delete-button',
      }),
    );
    await deleteButton.click();
  };
});
