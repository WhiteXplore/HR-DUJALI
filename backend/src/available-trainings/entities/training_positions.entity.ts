// training_positions.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AvailableTraining } from './available-training.entity';

@Entity('training_positions')
export class TrainingPosition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(
    () => AvailableTraining,
    (training) => training.training_positions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'training_id' }) // ✅ explicit foreign key column
  training: AvailableTraining;
}
