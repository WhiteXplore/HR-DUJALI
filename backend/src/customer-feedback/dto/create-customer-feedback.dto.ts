import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsIn,
} from 'class-validator';
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

  @IsOptional()
  @IsString()
  clientType?: string;

  @IsOptional()
  @IsString()
  sex?: string;

  @IsOptional()
  @IsString()
  age?: string;

  @IsOptional()
  @IsString()
  serviceAvailed?: string;

  @IsOptional()
  @IsString()
  municipality?: string;

  @IsOptional()
  @IsString()
  feedback?: string;

  // ✅ MAIN FEEDBACK SENTIMENT
  @IsOptional()
  @IsIn(['Positive', 'Neutral', 'Negative'])
  sentiment_status?: 'Positive' | 'Neutral' | 'Negative';

  @IsOptional()
  @IsNumber()
  sentiment_score?: number;

  // ✅ ADDITIONAL / PREDEFINED COMMENT SENTIMENT
  @IsOptional()
  @IsIn(['Positive', 'Neutral', 'Negative'])
  additional_sentiment_status?: 'Positive' | 'Neutral' | 'Negative';

  @IsOptional()
  @IsNumber()
  additional_sentiment_score?: number;

  // ✅ FINAL COMBINED SENTIMENT
  @IsOptional()
  @IsIn(['Positive', 'Neutral', 'Negative'])
  final_sentiment_status?: 'Positive' | 'Neutral' | 'Negative';

  @IsOptional()
  @IsNumber()
  final_sentiment_score?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  likertAnswers: AnswerDto[];
}
