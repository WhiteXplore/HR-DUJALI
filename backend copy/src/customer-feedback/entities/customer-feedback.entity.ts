import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FeedbackAnswer } from './feedback-answer.entity';
import { LikertAnswer } from './likert-answer.entity';

@Entity()
export class CustomerFeedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  office: string;

  @Column()
  controlNo: string;

  @Column()
  timeOfVisit: string;

  @Column({ nullable: true })
  clientType?: string;

  @Column({ nullable: true })
  sex?: string;

  @Column({ nullable: true })
  age?: string;

  @Column({ nullable: true })
  serviceAvailed?: string;

  @Column({ nullable: true })
  municipality?: string;

  @Column({ type: 'text', nullable: true })
  feedback?: string;

  // ✅ MAIN FEEDBACK SENTIMENT
  @Column({ nullable: true })
  sentiment_status?: 'Positive' | 'Neutral' | 'Negative';

  @Column({ type: 'int', nullable: true })
  sentiment_score?: number;

  // ✅ ADDITIONAL / PREDEFINED COMMENT SENTIMENT
  @Column({ nullable: true })
  additional_sentiment_status?: 'Positive' | 'Neutral' | 'Negative';

  @Column({ type: 'int', nullable: true })
  additional_sentiment_score?: number;

  // ✅ FINAL COMBINED SENTIMENT
  @Column({ nullable: true })
  final_sentiment_status?: 'Positive' | 'Neutral' | 'Negative';

  @Column({ type: 'int', nullable: true })
  final_sentiment_score?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fileDate: Date;

  @OneToMany(() => FeedbackAnswer, (a) => a.feedback, { cascade: true })
  answers: FeedbackAnswer[];

  @OneToMany(() => LikertAnswer, (l) => l.feedback, { cascade: true })
  likertAnswers: LikertAnswer[];
}
