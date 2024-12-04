import { TestBed } from '@angular/core/testing';

import { DisplayStateCorruptionToastService } from './display-state-corruption-toast.service';
import { ToastService } from '../../../ui/services/toast.service';
import { mockToastService } from '../../../../tests/mock-toast-service';

describe('DisplayStateCorruptionToastService', () => {
  let service: DisplayStateCorruptionToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ToastService,
          useValue: mockToastService,
        },
      ],
    });
    service = TestBed.inject(DisplayStateCorruptionToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show error toast', () => {
    service.show('test');

    expect(mockToastService.show).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'test state is corrupted',
      detail: "Application won't behave as expected.",
    });
  });
});
