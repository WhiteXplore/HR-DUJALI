import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CustomerFeedback } from './customer-feedback.entity';

@Entity()
export class LikertAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column()
  value: string; // ✅ same as FeedbackAnswer

  @ManyToOne(() => CustomerFeedback, (feedback) => feedback.likertAnswers, {
    onDelete: 'CASCADE',
  })
  feedback: CustomerFeedback;
}
