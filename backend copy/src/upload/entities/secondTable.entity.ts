import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FirstTable } from './firstTable.entity';

@Entity('educational_table')
export class SecondTable {
  @PrimaryGeneratedColumn()
  second_table_id: number;

  @Column()
  level: string; // New column for Level

  @Column()
  name_of_school: string; // New column for Name of School

  @Column()
  educ_from: string;

  @Column()
  educ_to: string;

  @Column()
  highest_level: string;

  @Column()
  year_graduated: string;

  @Column()
  basic_education: string;

  @Column()
  scholarship: string;

  @ManyToOne(() => FirstTable, (firstTable) => firstTable.secondTable, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'first_table_id' })
  firstTable: FirstTable;
}
