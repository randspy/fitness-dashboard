import { Exercise } from './exercise.model';

import { ExerciseForm } from './exercise.model';

export function createExercise(exerciseForm: ExerciseForm): Exercise {
  return { ...exerciseForm, usage: [] };
}

export function updateExercise(
  exercise: Exercise | undefined,
  exerciseForm: ExerciseForm,
): Exercise {
  return { ...(exercise ?? { usage: [] }), ...exerciseForm };
}
