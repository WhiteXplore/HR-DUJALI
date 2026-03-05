// create-available-training.dto.ts
import {
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
  IsInt,
} from 'class-validator';

export class CreateAvailableTrainingDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  title_description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  type_of_ld?: string;

  @IsDateString()
  @IsOptional()
  date_from?: string;

  @IsDateString()
  @IsOptional()
  date_to?: string;

  @IsString()
  @IsOptional()
  training_hours?: string;

  @IsInt()
  @IsOptional()
  experience_year_from?: number;

  @IsInt()
  @IsOptional()
  experience_year_to?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  training_position?: string[];

  @IsArray() // ✅ FIXED: should be array since it’s OneToMany
  @IsString({ each: true })
  @IsOptional()
  training_educational_level?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  employment_status?: string[];
}
