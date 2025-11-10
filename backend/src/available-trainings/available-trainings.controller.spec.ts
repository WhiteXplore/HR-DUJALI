import { Test, TestingModule } from '@nestjs/testing';
import { AvailableTrainingsController } from './available-trainings.controller';
import { AvailableTrainingsService } from './available-trainings.service';

describe('AvailableTrainingsController', () => {
  let controller: AvailableTrainingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailableTrainingsController],
      providers: [AvailableTrainingsService],
    }).compile();

    controller = module.get<AvailableTrainingsController>(AvailableTrainingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
