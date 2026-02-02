import { IsString, MaxLength, IsOptional, IsNumber } from 'class-validator';

export class CreateRecordOfAppointmentDto {
  @IsOptional()
  @IsNumber()
  record_id?: number;

  @IsString()
  @IsOptional()
  @MaxLength(155)
  period_from?: string;

  @IsString()
  @IsOptional()
  @MaxLength(155)
  period_to?: string;

  @IsString()
  @IsOptional()
  @MaxLength(155)
  roa_designation?: string;

  @IsString()
  @IsOptional()
  @MaxLength(155)
  roa_sg?: string;

  @IsString()
  @IsOptional()
  @MaxLength(155)
  roa_step?: string;

  @IsString()
  @IsOptional()
  @MaxLength(155)
  roa_status?: string;

  @IsString()
  @IsOptional()
  @MaxLength(155)
  roa_basic_salary?: string;

  @IsString()
  @IsOptional()
  @MaxLength(155)
  roa_basic_salary_day?: string;

  @IsString()
  @IsOptional()
  @MaxLength(155)
  office?: string;

  @IsString()
  @IsOptional()
  @MaxLength(155)
  remarks?: string;
}
