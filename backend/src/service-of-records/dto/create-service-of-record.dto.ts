import {
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRecordOfAppointmentDto } from './create-record-of-appointment.dto';

export class CreateServiceOfRecordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(155)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(155)
  middle_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(155)
  last_name: string;

  @IsDateString() // Accepts ISO date string like '2024-05-07'
  @IsNotEmpty()
  birthdate: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(155)
  birth_place: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(155)
  employee_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(155)
  department: string;

  @ValidateNested({ each: true })
  @Type(() => CreateRecordOfAppointmentDto)
  @IsOptional()
  serviceRecords?: CreateRecordOfAppointmentDto[];
}
