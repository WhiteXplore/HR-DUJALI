import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionCriteriaService } from './promotion-criteria.service';
import { PromotionCriteriaController } from './promotion-criteria.controller';
import { PromotionCriterion } from './entities/promotion-criterion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PromotionCriterion])],
  controllers: [PromotionCriteriaController],
  providers: [PromotionCriteriaService],
  exports: [PromotionCriteriaService],
})
export class PromotionCriteriaModule {}
