import {
  IsString,
  IsDateString,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AttendanceRecordDataDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  in_am?: string | null;

  @IsOptional()
  @IsString()
  out_am?: string | null;

  @IsOptional()
  @IsString()
  in_pm?: string | null;

  @IsOptional()
  @IsString()
  out_pm?: string | null;
}

export class CreateAttendanceRecordDto {
  @IsString()
  employee_id: string;

  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDataDto)
  records: AttendanceRecordDataDto[];
}
