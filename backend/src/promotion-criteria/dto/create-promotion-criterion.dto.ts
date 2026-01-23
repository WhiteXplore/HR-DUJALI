import { IsArray, IsInt, IsOptional } from 'class-validator';

export class CreatePromotionCriterionDto {
  @IsOptional()
  @IsInt()
  age_requirement?: number;

  @IsOptional()
  @IsArray()
  education_requirement?: string[];

  @IsOptional()
  @IsInt()
  work_experience_requirement?: number;

  @IsOptional()
  @IsInt()
  commendation_count_requirement?: number;

  @IsOptional()
  @IsInt()
  commendation_hours_requirement?: number;

  @IsOptional()
  @IsInt()
  attendance_hours_requirement?: number;
}
