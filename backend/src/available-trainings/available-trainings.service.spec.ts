import { Test, TestingModule } from '@nestjs/testing';
import { AvailableTrainingsService } from './available-trainings.service';

describe('AvailableTrainingsService', () => {
  let service: AvailableTrainingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvailableTrainingsService],
    }).compile();

    service = module.get<AvailableTrainingsService>(AvailableTrainingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
