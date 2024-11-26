import { Exercise } from './exercise.types';

import { ExerciseForm } from './exercise.types';

export function createExercise(exerciseForm: ExerciseForm): Exercise {
  return { ...exerciseForm, usage: [], hidden: false };
}

export function updateExercise(
  exercise: Exercise | undefined,
  exerciseForm: ExerciseForm,
): Exercise {
  return { ...(exercise ?? { usage: [], hidden: false }), ...exerciseForm };
}
