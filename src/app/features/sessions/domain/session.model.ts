export interface Session {
  name: string;
  id: string;
  date: Date;
  exercises: SessionExercise[];
}

export interface SessionExercise {
  id: string;
  name: string;
  sets: SessionExerciseSet[];
}

export interface SessionExerciseSet {
  id: string;
  repetitions: number;
  weight: number;
}
