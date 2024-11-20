export interface ExerciseUsage {
  id: string;
}
export interface ExerciseForm {
  id: string;
  name: string;
  description: string;
}

export interface Exercise extends ExerciseForm {
  usage: ExerciseUsage[];
}
