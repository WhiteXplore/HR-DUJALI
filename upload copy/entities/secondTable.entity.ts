import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FirstTable } from './firstTable.entity';

@Entity('second_table')
export class SecondTable {
  @PrimaryGeneratedColumn()
  second_table_id: number;

  @Column()
  address: string;

  @ManyToOne(() => FirstTable, (firstTable) => firstTable.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'first_table_id' })
  firstTable: FirstTable;
}
