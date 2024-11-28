import { TestBed } from '@angular/core/testing';

import { DisplayStateCorruptionToastService } from './display-state-corruption-toast.service';
import { MessageService } from 'primeng/api';

describe('DisplayStateCorruptionToastService', () => {
  let service: DisplayStateCorruptionToastService;
  let messageService: jest.Mocked<MessageService>;
  beforeEach(() => {
    messageService = {
      add: jest.fn(),
    } as unknown as jest.Mocked<MessageService>;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: MessageService,
          useValue: messageService,
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

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'test state is corrupted',
      detail: "Application won't behave as expected.",
      sticky: true,
    });
  });
});
