import { Session } from '../app/core/sessions/domain/session.model';
import { Exercise } from '../app/core/exercises/domain/exercise.model';

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
    hidden: false,
    ...exercise,
  };
}
