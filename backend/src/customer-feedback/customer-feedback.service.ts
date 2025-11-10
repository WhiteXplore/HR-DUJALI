import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerFeedback } from './entities/customer-feedback.entity';
import { FeedbackAnswer } from './entities/feedback-answer.entity';
import { LikertAnswer } from './entities/likert-answer.entity';
import { CreateCustomerFeedbackDto } from './dto/create-customer-feedback.dto';
import { UpdateCustomerFeedbackDto } from './dto/update-customer-feedback.dto';
import * as Sentiment from 'sentiment';
import * as natural from 'natural';
import * as stopword from 'stopword';

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

  // ----------------- NLP Helper -----------------
  private preprocessText(text: string): string {
    if (!text) return '';
    // Lowercase
    let cleanText = text.toLowerCase();
    // Tokenize
    const tokenizer = new natural.WordTokenizer();
    let tokens = tokenizer.tokenize(cleanText);
    // Remove stopwords
    tokens = stopword.removeStopwords(tokens);
    // Stem words
    const stemmer = natural.PorterStemmer;
    tokens = tokens.map((token) => stemmer.stem(token));
    return tokens.join(' ');
  }

  private analyzeSentiment(text: string = '') {
    const sentiment = new Sentiment();
    const processedText = this.preprocessText(text);
    const result = sentiment.analyze(processedText);
    return {
      sentiment:
        result.score > 0
          ? 'Positive'
          : result.score < 0
            ? 'Negative'
            : 'Neutral',
      score: result.score,
    };
  }

  // ----------------- CRUD -----------------
  async create(createCustomerFeedbackDto: CreateCustomerFeedbackDto) {
    try {
      // ✅ Use default empty string to avoid TS error
      const sentimentResult = this.analyzeSentiment(
        createCustomerFeedbackDto.feedback || '',
      );

      const feedback = this.feedbackRepo.create({
        ...createCustomerFeedbackDto,
        sentiment: sentimentResult.sentiment,
        sentimentScore: sentimentResult.score,
        answers: createCustomerFeedbackDto.answers?.map((a) =>
          this.feedbackAnswerRepo.create(a),
        ),
        likertAnswers: createCustomerFeedbackDto.likertAnswers?.map((a) =>
          this.likertAnswerRepo.create(a),
        ),
      });

      return await this.feedbackRepo.save(feedback);
    } catch (err) {
      console.error('Error saving feedback:', err);
      throw err;
    }
  }

  async findAll() {
    return await this.feedbackRepo.find({
      relations: ['answers', 'likertAnswers'],
    });
  }

  async findOne(id: number) {
    const feedback = await this.feedbackRepo.findOne({
      where: { id },
      relations: ['answers', 'likertAnswers'],
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return feedback;
  }

  async update(id: number, updateDto: UpdateCustomerFeedbackDto) {
    const feedback = await this.feedbackRepo.preload({
      id,
      ...updateDto,
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    // Recalculate sentiment if feedback text is updated
    if (updateDto.feedback) {
      const sentimentResult = this.analyzeSentiment(updateDto.feedback);
      feedback.sentiment = sentimentResult.sentiment;
      feedback.sentimentScore = sentimentResult.score;
    }

    return await this.feedbackRepo.save(feedback);
  }

  async remove(id: number) {
    const feedback = await this.findOne(id);
    return await this.feedbackRepo.remove(feedback);
  }
}
