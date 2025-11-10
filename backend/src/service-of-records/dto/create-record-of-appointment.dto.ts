import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRecordOfAppointmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(155)
  period_from: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(155)
  period_to: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(155)
  roa_designation: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(155)
  roa_sg: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(155)
  roa_step: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(155)
  roa_status: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(155)
  roa_basic_salary: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(155)
  roa_basic_salary_day: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(155)
  office: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(155)
  remarks: string;
}
