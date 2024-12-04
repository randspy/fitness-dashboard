import { TestBed } from '@angular/core/testing';

import { ConfirmationDialogService } from './confirmation-dialog.service';
import { ConfirmationService } from 'primeng/api';

describe('ConfirmationDialogService', () => {
  let service: ConfirmationDialogService;
  let confirmationService: ConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmationService, ConfirmationDialogService],
    });
    service = TestBed.inject(ConfirmationDialogService);
    confirmationService = TestBed.inject(ConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call confirm on the confirmation service', () => {
    const spy = jest.spyOn(confirmationService, 'confirm');
    service.show({ header: 'Test', message: 'Test' });
    expect(spy).toHaveBeenCalledWith({ header: 'Test', message: 'Test' });
  });
});
