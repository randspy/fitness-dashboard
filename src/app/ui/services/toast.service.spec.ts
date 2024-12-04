import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';
import { MessageService } from 'primeng/api';

describe('ToastService', () => {
  let service: ToastService;
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
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show toast', () => {
    service.show({
      severity: 'success',
      summary: 'test',
      detail: 'test',
    });

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'test',
      detail: 'test',
      sticky: true,
    });
  });
});
