import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FirstTable } from './firstTable.entity';

@Entity('skills_table')
export class ThirdTable {
  @PrimaryGeneratedColumn()
  third_table_id: number;

  @Column({ default: 'N/A' })
  special_skills: string;

  @ManyToOne(() => FirstTable, (firstTable) => firstTable.thirdTable, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'first_table_id' })
  firstTable: FirstTable;
}
