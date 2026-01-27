import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerFeedback } from './entities/customer-feedback.entity';
import { FeedbackAnswer } from './entities/feedback-answer.entity';
import { LikertAnswer } from './entities/likert-answer.entity';
import { CreateCustomerFeedbackDto } from './dto/create-customer-feedback.dto';
import { UpdateCustomerFeedbackDto } from './dto/update-customer-feedback.dto';

@Injectable()
export class CustomerFeedbackService {
  constructor(
    @InjectRepository(CustomerFeedback)
    private feedbackRepo: Repository<CustomerFeedback>,

    @InjectRepository(FeedbackAnswer)
    private feedbackAnswerRepo: Repository<FeedbackAnswer>,

    @InjectRepository(LikertAnswer)
    private likertAnswerRepo: Repository<LikertAnswer>,
  ) {}

  // ✅ CREATE
  async create(dto: CreateCustomerFeedbackDto) {
    const feedback = this.feedbackRepo.create({
      ...dto, // 🔥 TRUST VUE COMPLETELY
      answers: dto.answers?.map((a) => this.feedbackAnswerRepo.create(a)),
      likertAnswers: dto.likertAnswers?.map((a) =>
        this.likertAnswerRepo.create(a),
      ),
    });

    return this.feedbackRepo.save(feedback);
  }

  // ✅ READ
  findAll() {
    return this.feedbackRepo.find({
      relations: ['answers', 'likertAnswers'],
    });
  }

  async findOne(id: number) {
    const feedback = await this.feedbackRepo.findOne({
      where: { id },
      relations: ['answers', 'likertAnswers'],
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback ${id} not found`);
    }

    return feedback;
  }

  // ✅ UPDATE
  async update(id: number, dto: UpdateCustomerFeedbackDto) {
    const feedback = await this.feedbackRepo.preload({
      id,
      ...dto, // 🔥 NO sentiment override
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback ${id} not found`);
    }

    return this.feedbackRepo.save(feedback);
  }

  // ✅ DELETE
  async remove(id: number) {
    const feedback = await this.findOne(id);
    return this.feedbackRepo.remove(feedback);
  }
}
