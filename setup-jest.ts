import 'jest-preset-angular/setup-jest';
import { Session } from './src/app/core/sessions/domain/session.model';
import { Exercise } from './src/app/core/exercises/domain/exercise.model';

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

export function generateExercise(exercise: Partial<Exercise>) {
  return {
    id: 'test-uuid',
    name: 'test-exercise',
    description: 'test-description',
    usage: [],
    ...exercise,
  };
}
