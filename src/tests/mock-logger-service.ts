import { ILoggerService } from '../app/core/errors/logger.model';

export const mockLoggerService: jest.Mocked<ILoggerService> = {
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};
