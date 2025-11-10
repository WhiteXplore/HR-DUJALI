import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUploadDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  contactNumber: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  addresses: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills: string[];
}
