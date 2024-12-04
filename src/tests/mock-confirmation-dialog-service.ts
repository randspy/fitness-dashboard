import { ConfirmationDialogService } from '../app/ui/services/confirmation-dialog.service';

export const mockConfirmationDialogService: jest.Mocked<ConfirmationDialogService> =
  {
    show: jest.fn(),
  } as Partial<ConfirmationDialogService> as jest.Mocked<ConfirmationDialogService>;
