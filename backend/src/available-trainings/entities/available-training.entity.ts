// available-training.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TrainingPosition } from './training_positions.entity';
import { EmploymentStatus } from './employment_status.entity';
import { TrainingEducationalLevel } from './training_educational_level.entity';

@Entity('available_trainings')
export class AvailableTraining {
  @PrimaryGeneratedColumn()
  training_id: number;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  title_description: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'varchar', nullable: true })
  type_of_ld: string;

  @Column({ type: 'int', nullable: true })
  experience_year_from: number;

  @Column({ type: 'int', nullable: true })
  experience_year_to: number;

  @Column({ type: 'date', nullable: true })
  date_from: string;

  @Column({ type: 'date', nullable: true })
  date_to: string;

  @Column({ type: 'varchar', nullable: true })
  training_hours: string;

  @OneToMany(() => TrainingPosition, (pos) => pos.training, {
    cascade: true,
  })
  training_positions: TrainingPosition[];

  @OneToMany(() => EmploymentStatus, (status) => status.training, {
    cascade: true,
  })
  employment_statuses: EmploymentStatus[];

  @OneToMany(() => TrainingEducationalLevel, (eduLevel) => eduLevel.training, {
    cascade: true,
  })
  training_educational_levels: TrainingEducationalLevel[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
