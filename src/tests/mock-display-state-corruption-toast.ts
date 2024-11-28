import { DisplayStateCorruptionToastService } from '../app/core/errors/services/display-state-corruption-toast.service';

export const mockDisplayStateCorruptionToastService: jest.Mocked<DisplayStateCorruptionToastService> =
  {
    show: jest.fn(),
  } as Partial<DisplayStateCorruptionToastService> as jest.Mocked<DisplayStateCorruptionToastService>;
