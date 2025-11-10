// training-educational-level.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AvailableTraining } from './available-training.entity';

@Entity('training_educational_levels')
export class TrainingEducationalLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;
  @ManyToOne(
    () => AvailableTraining,
    (training) => training.training_educational_levels,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'training_id' })
  training: AvailableTraining;
}
