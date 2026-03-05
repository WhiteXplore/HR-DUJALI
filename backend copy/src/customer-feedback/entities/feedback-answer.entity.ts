import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CustomerFeedback } from './customer-feedback.entity';

@Entity()
export class FeedbackAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column()
  value: string; // ✅ consistent with frontend

  @ManyToOne(() => CustomerFeedback, (feedback) => feedback.answers, {
    onDelete: 'CASCADE',
  })
  feedback: CustomerFeedback;
}
