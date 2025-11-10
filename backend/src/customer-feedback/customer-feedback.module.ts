import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerFeedbackService } from './customer-feedback.service';
import { CustomerFeedbackController } from './customer-feedback.controller';
import { CustomerFeedback } from './entities/customer-feedback.entity';
import { FeedbackAnswer } from './entities/feedback-answer.entity';
import { LikertAnswer } from './entities/likert-answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerFeedback, FeedbackAnswer, LikertAnswer]),
  ],
  controllers: [CustomerFeedbackController],
  providers: [CustomerFeedbackService],
  exports: [CustomerFeedbackService], // ✅ in case another module needs it
})
export class CustomerFeedbackModule {}
