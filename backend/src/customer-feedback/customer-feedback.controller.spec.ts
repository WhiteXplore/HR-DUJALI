import { Test, TestingModule } from '@nestjs/testing';
import { CustomerFeedbackController } from './customer-feedback.controller';
import { CustomerFeedbackService } from './customer-feedback.service';

describe('CustomerFeedbackController', () => {
  let controller: CustomerFeedbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerFeedbackController],
      providers: [CustomerFeedbackService],
    }).compile();

    controller = module.get<CustomerFeedbackController>(CustomerFeedbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
