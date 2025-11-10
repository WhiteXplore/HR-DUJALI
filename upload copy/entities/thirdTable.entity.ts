import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FirstTable } from './firstTable.entity';

@Entity('third_table')
export class ThirdTable {
  @PrimaryGeneratedColumn()
  third_table_id: number;

  @Column()
  skills: string;

  @ManyToOne(() => FirstTable, (firstTable) => firstTable.skills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'first_table_id' })
  firstTable: FirstTable;
}
