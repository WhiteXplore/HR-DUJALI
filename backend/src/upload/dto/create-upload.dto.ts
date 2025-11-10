import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsDateString,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class EducationDto {
  @IsNotEmpty()
  @IsString()
  level: string;

  @IsNotEmpty()
  @IsString()
  name_of_school: string;

  @IsOptional()
  @IsString()
  educ_from?: string;

  @IsOptional()
  @IsString()
  educ_to?: string;

  @IsOptional()
  @IsString()
  highest_level?: string;

  @IsOptional()
  @IsString()
  basic_education?: string;

  @IsOptional()
  @IsString()
  year_graduated?: string;

  @IsOptional()
  @IsString()
  scholarship?: string;
}

class CivilServiceDto {
  @IsNotEmpty()
  @IsString()
  career_service: string;

  @IsOptional()
  @IsString()
  rating?: string;

  @IsOptional()
  @IsString()
  date_of_exam?: string;

  @IsOptional()
  @IsString()
  place_of_exam?: string;

  @IsOptional()
  @IsString()
  license_number?: string;

  @IsOptional()
  @IsString()
  license_validity?: string;
}
class LearningDevDto {
  @IsNotEmpty()
  @IsString()
  title_learning_development: string;

  @IsOptional()
  @IsString()
  ld_from?: string;

  @IsOptional()
  @IsString()
  ld_to?: string;

  @IsOptional()
  @IsString()
  ld_number_of_hours?: string;

  @IsOptional()
  @IsString()
  type_of_ld?: string;

  @IsOptional()
  @IsString()
  ld_conducted_sponsor?: string;
}

export class AssignTrainingDto {
  @IsNotEmpty()
  @IsString()
  training_id: string;

  @IsNotEmpty()
  @IsArray()
  employee_ids: string[];

  @ValidateNested()
  @Type(() => LearningDevDto)
  trainingDetails: LearningDevDto;
}

class SkillsDto {
  @IsNotEmpty()
  @IsString()
  special_skills: string;
}

class NonAcadDto {
  @IsNotEmpty()
  @IsString()
  non_academic: string;
}

class MembershipDto {
  @IsNotEmpty()
  @IsString()
  membership: string;
}

export class CreateUploadDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  middle_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  suffix?: string;

  @IsOptional()
  @IsString()
  birthdate?: string;

  @IsOptional()
  @IsString()
  place_of_birth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  civil_status?: string;

  @IsOptional()
  @IsString()
  height?: string;

  @IsOptional()
  @IsString()
  weight?: string;

  @IsOptional()
  @IsString()
  blood_type?: string;

  @IsOptional()
  @IsString()
  citizenship?: string;

  @IsOptional()
  @IsBoolean()
  is_dual_citizen?: boolean;

  @IsOptional()
  @IsString()
  gsis_id?: string;

  @IsOptional()
  @IsString()
  pagibig_id?: string;

  @IsOptional()
  @IsString()
  philhealth?: string;

  @IsOptional()
  @IsString()
  sss_number?: string;

  @IsOptional()
  @IsString()
  tin_number?: string;

  @IsOptional()
  @IsString()
  telephone_number?: string;

  @IsOptional()
  @IsString()
  mobile_number?: string;

  @IsOptional()
  @IsString()
  agency?: string;

  // Address fields
  @IsOptional()
  @IsString()
  house_number?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  subdivision?: string;

  @IsOptional()
  @IsString()
  barangay?: string;

  @IsOptional()
  @IsString()
  municipality?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  zip_code?: string;

  @IsOptional()
  @IsString()
  same_house_number?: string;

  @IsOptional()
  @IsString()
  same_street?: string;

  @IsOptional()
  @IsString()
  same_subdivision?: string;

  @IsOptional()
  @IsString()
  same_barangay?: string;

  @IsOptional()
  @IsString()
  same_municipality?: string;

  @IsOptional()
  @IsString()
  same_province?: string;

  @IsOptional()
  @IsString()
  same_zip_code?: string;

  @IsOptional()
  @IsString()
  employment_status?: string;

  @IsOptional()
  @IsString()
  employee_id?: string;

  // Nested arrays (optional, but must be arrays if present)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  educationalRecords?: EducationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CivilServiceDto)
  civilRecords?: CivilServiceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LearningDevDto)
  learningRecords?: LearningDevDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillsDto)
  specialSkillsRecords?: SkillsDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NonAcadDto)
  nonAcadRecords?: NonAcadDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MembershipDto)
  membershipRecords?: MembershipDto[];
}
