export class CreatePredictiveDto {
  positionTitle: string;
  department: string;
  govService: boolean;
  educationLevel: string; // e.g., 'High School', 'College', 'Postgraduate'
  yearsExperience: number;
  lastTrainingDate: string; // ISO string format
}
