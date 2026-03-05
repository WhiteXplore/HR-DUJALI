import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { AvailableTraining } from './available-training.entity';

@Entity('employment_statuses')
export class EmploymentStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(
    () => AvailableTraining,
    (training) => training.employment_statuses,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'training_id' })
  training: AvailableTraining;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
