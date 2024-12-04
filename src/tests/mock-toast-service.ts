import { ToastService } from '../app/ui/services/toast.service';

export const mockToastService: jest.Mocked<ToastService> = {
  show: jest.fn(),
} as Partial<ToastService> as jest.Mocked<ToastService>;
