import 'jest-preset-angular/setup-jest';

Object.defineProperty(global.crypto, 'randomUUID', {
  value: jest.fn().mockReturnValue('test-uuid'),
});
