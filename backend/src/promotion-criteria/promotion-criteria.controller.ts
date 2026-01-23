import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PromotionCriteriaService } from './promotion-criteria.service';
import { CreatePromotionCriterionDto } from './dto/create-promotion-criterion.dto';
import { UpdatePromotionCriterionDto } from './dto/update-promotion-criterion.dto';

@Controller('promotion-criteria')
export class PromotionCriteriaController {
  constructor(
    private readonly promotionCriteriaService: PromotionCriteriaService,
  ) {}

  @Post()
  create(@Body() dto: CreatePromotionCriterionDto) {
    return this.promotionCriteriaService.create(dto);
  }

  @Get()
  findAll() {
    return this.promotionCriteriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionCriteriaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePromotionCriterionDto) {
    return this.promotionCriteriaService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionCriteriaService.remove(+id);
  }
}
