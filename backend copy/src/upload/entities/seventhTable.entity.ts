import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FirstTable } from './firstTable.entity';

@Entity('membership_table')
export class SeventhTable {
  @PrimaryGeneratedColumn()
  seventh_table_id: number;

  @Column({ default: 'N/A' })
  membership: string;

  @ManyToOne(() => FirstTable, (firstTable) => firstTable.seventhTable, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'first_table_id' })
  firstTable: FirstTable;
}
