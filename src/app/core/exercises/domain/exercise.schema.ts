import { z } from 'zod';

export const ExerciseUsageSchema = z.object({
  id: z.string(),
});

export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  usage: z.array(ExerciseUsageSchema),
  hidden: z.boolean(),
  position: z.number(),
});
