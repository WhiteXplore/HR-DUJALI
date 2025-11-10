import { PartialType } from '@nestjs/mapped-types';
import { CreateAvailableTrainingDto } from './create-available-training.dto';
import { IsArray, IsString, IsOptional } from 'class-validator';

export class UpdateAvailableTrainingDto extends PartialType(
  CreateAvailableTrainingDto,
) {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  training_position?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  employment_status?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  training_education_levels?: string[];
}
