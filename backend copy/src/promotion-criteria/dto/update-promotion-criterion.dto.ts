import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotionCriterionDto } from './create-promotion-criterion.dto';

export class UpdatePromotionCriterionDto extends PartialType(CreatePromotionCriterionDto) {}
