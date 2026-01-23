import { Test, TestingModule } from '@nestjs/testing';
import { PromotionCriteriaService } from './promotion-criteria.service';

describe('PromotionCriteriaService', () => {
  let service: PromotionCriteriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromotionCriteriaService],
    }).compile();

    service = module.get<PromotionCriteriaService>(PromotionCriteriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
