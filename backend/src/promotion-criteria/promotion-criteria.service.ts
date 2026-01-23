import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromotionCriterion } from './entities/promotion-criterion.entity';
import { CreatePromotionCriterionDto } from './dto/create-promotion-criterion.dto';
import { UpdatePromotionCriterionDto } from './dto/update-promotion-criterion.dto';

@Injectable()
export class PromotionCriteriaService {
  constructor(
    @InjectRepository(PromotionCriterion)
    private readonly promotionCriteriaRepo: Repository<PromotionCriterion>,
  ) {}

  async create(dto: CreatePromotionCriterionDto) {
    const criterion = this.promotionCriteriaRepo.create(dto);
    return await this.promotionCriteriaRepo.save(criterion);
  }

  async findAll() {
    return await this.promotionCriteriaRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const criterion = await this.promotionCriteriaRepo.findOne({
      where: { id },
    });

    if (!criterion) {
      throw new NotFoundException('Promotion criterion not found');
    }

    return criterion;
  }

  async update(id: number, dto: UpdatePromotionCriterionDto) {
    const criterion = await this.findOne(id);

    Object.assign(criterion, dto);

    return await this.promotionCriteriaRepo.save(criterion);
  }

  async remove(id: number) {
    const criterion = await this.findOne(id);
    await this.promotionCriteriaRepo.remove(criterion);

    return { message: 'Promotion criterion deleted successfully' };
  }
}
