import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AnswerDto {
  @IsString()
  question: string;

  @IsString()
  value: string;
}

export class CreateCustomerFeedbackDto {
  @IsString()
  office: string;

  @IsString()
  controlNo: string;

  @IsString()
  timeOfVisit: string;

  @IsString()
  @IsOptional()
  clientType: string;

  @IsString()
  @IsOptional()
  sex: string;

  @IsOptional()
  age?: string;

  @IsOptional()
  serviceAvailed?: string;

  @IsOptional()
  municipality?: string;

  @IsOptional()
  feedback?: string;

  @IsOptional()
  sentiment?: string;

  @IsOptional()
  sentimentScore?: number;

  @IsOptional()
  additional_comment_sentimentScore?: number;

  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  likertAnswers: AnswerDto[];
}
