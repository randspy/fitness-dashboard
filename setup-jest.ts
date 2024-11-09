import 'jest-preset-angular/setup-jest';
import { Session } from './src/app/core/sessions/domain/session.model';

Object.defineProperty(global.crypto, 'randomUUID', {
  value: jest.fn().mockReturnValue('test-uuid'),
});

export function generateSession(session: Partial<Session>) {
  return {
    id: 'test-uuid',
    date: new Date(),
    name: 'test-session',
    exercises: [],
    ...session,
  };
}
