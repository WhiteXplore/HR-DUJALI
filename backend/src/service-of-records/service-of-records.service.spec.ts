import { Test, TestingModule } from '@nestjs/testing';
import { ServiceOfRecordsService } from './service-of-records.service';

describe('ServiceOfRecordsService', () => {
  let service: ServiceOfRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceOfRecordsService],
    }).compile();

    service = module.get<ServiceOfRecordsService>(ServiceOfRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
