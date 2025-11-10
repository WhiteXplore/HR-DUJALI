import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FirstTable } from './firstTable.entity';

@Entity('learning_table')
export class FifthTable {
  @PrimaryGeneratedColumn()
  fifth_table_id: number;

  @Column('text')
  title_learning_development: string;

  @Column()
  ld_from: string;

  @Column()
  ld_to: string;

  @Column()
  ld_number_of_hours: string;

  @Column()
  type_of_ld: string;

  @Column()
  ld_conducted_sponsor: string;

  @ManyToOne(() => FirstTable, (firstTable) => firstTable.fifthTable, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'first_table_id' })
  firstTable: FirstTable;

  @Column()
  first_table_id: number;
}
