// customer-feedback.entity.ts
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
  clientType: string;

  @Column({ nullable: true })
  sex: string;

  @Column({ nullable: true })
  age: string;

  @Column({ nullable: true })
  serviceAvailed: string;

  @Column({ nullable: true })
  municipality: string;

  @Column({ nullable: true, type: 'text' })
  feedback: string;

  @Column({ nullable: true })
  sentiment: string;

  @Column({ type: 'int', nullable: true })
  sentimentScore: number;

  @Column({ type: 'int', nullable: true })
  additional_comment_sentimentScore: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fileDate: Date;

  // ✅ Relationships
  @OneToMany(() => FeedbackAnswer, (answer) => answer.feedback, {
    cascade: true,
  })
  answers: FeedbackAnswer[];

  @OneToMany(() => LikertAnswer, (likert) => likert.feedback, {
    cascade: true,
  })
  likertAnswers: LikertAnswer[];
}
