import { Test, TestingModule } from '@nestjs/testing';
import { PredictiveService } from './predictive.service';

describe('PredictiveService', () => {
  let service: PredictiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PredictiveService],
    }).compile();

    service = module.get<PredictiveService>(PredictiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
