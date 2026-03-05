// dto/update-learning.dto.ts
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class UpdateLearningDto {
  @IsNotEmpty()
  first_table_id: number;

  @IsString()
  @IsNotEmpty()
  title_learning_development: string;

  @IsDateString()
  ld_from: string;

  @IsDateString()
  ld_to: string;

  @IsDateString()
  ld_number_of_hours: string;

  @IsString()
  @IsNotEmpty()
  type_of_ld: string;

  @IsString()
  @IsNotEmpty()
  ld_conducted_sponsor: string;
}
