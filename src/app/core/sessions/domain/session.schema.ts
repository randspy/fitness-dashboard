import { z } from 'zod';

export const SetSchema = z.object({
  id: z.string(),
  repetitions: z.number(),
  weight: z.number(),
});

export const SessionExerciseSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  sets: z.array(SetSchema),
});

export const SessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.string(), // Since it comes from JSON as string
  exercises: z.array(SessionExerciseSchema),
});
