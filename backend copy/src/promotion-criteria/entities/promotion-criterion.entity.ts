import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('promotion_criteria')
export class PromotionCriterion {
  @PrimaryGeneratedColumn()
  id: number;

  // ✅ NEW
  @Column({ type: 'varchar', length: 255, nullable: true })
  department: string;

  @Column({ type: 'int', nullable: true })
  age_requirement: number;

  // Stored as JSON array (["College", "Graduate School"])
  @Column({ type: 'json', nullable: true })
  education_requirement: string[];

  @Column({ type: 'int', nullable: true })
  work_experience_requirement: number;

  @Column({ type: 'int', nullable: true })
  commendation_count_requirement: number;

  @Column({ type: 'int', nullable: true })
  commendation_hours_requirement: number;

  @Column({ type: 'int', nullable: true })
  attendance_hours_requirement: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
