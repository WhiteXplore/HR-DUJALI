import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FirstTable } from './firstTable.entity';

@Entity('civil_table')
export class FourthTable {
  @PrimaryGeneratedColumn()
  fourth_table_id: number;

  @Column()
  career_service: string;

  @Column()
  rating: string;

  @Column()
  date_of_exam: string;

  @Column()
  place_of_exam: string;

  @Column()
  license_number: string;

  @Column()
  license_validity: string;

  @ManyToOne(() => FirstTable, (firstTable) => firstTable.fourthTable, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'first_table_id' })
  firstTable: FirstTable;
}
