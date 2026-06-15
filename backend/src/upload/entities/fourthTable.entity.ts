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

  @Column({ nullable: true })
  career_service: string;

  @Column({ nullable: true })
  rating: string;

  @Column({ nullable: true })
  date_of_exam: string;

  @Column({ nullable: true })
  place_of_exam: string;

  @Column({ nullable: true })
  license_number: string;

  @Column({ nullable: true })
  license_validity: string;

  @ManyToOne(() => FirstTable, (firstTable) => firstTable.fourthTable, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'first_table_id' })
  firstTable: FirstTable;
}
