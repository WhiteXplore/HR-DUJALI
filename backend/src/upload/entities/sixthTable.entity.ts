import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FirstTable } from './firstTable.entity';

@Entity('non_table')
export class SixthTable {
  @PrimaryGeneratedColumn()
  sixth_table_id: number;

  @Column({ default: 'N/A' })
  non_academic: string;

  @ManyToOne(() => FirstTable, (firstTable) => firstTable.sixthTable, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'first_table_id' })
  firstTable: FirstTable;
}
