import { Test, TestingModule } from '@nestjs/testing';
import { ServiceOfRecordsController } from './service-of-records.controller';
import { ServiceOfRecordsService } from './service-of-records.service';

describe('ServiceOfRecordsController', () => {
  let controller: ServiceOfRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceOfRecordsController],
      providers: [ServiceOfRecordsService],
    }).compile();

    controller = module.get<ServiceOfRecordsController>(ServiceOfRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
