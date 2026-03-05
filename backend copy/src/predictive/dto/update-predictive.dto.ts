import { PartialType } from '@nestjs/mapped-types';
import { CreatePredictiveDto } from './create-predictive.dto';

export class UpdatePredictiveDto extends PartialType(CreatePredictiveDto) {}
