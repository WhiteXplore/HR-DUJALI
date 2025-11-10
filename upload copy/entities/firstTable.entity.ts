import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SecondTable } from './secondTable.entity';
import { ThirdTable } from './thirdTable.entity';

@Entity('first_table')
export class FirstTable {
  @PrimaryGeneratedColumn()
  first_table_id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'contact_number' })
  contactNumber: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => SecondTable, (secondTable) => secondTable.firstTable, {
    cascade: true,
  })
  addresses: SecondTable[];

  @OneToMany(() => ThirdTable, (thirdTable) => thirdTable.firstTable, {
    cascade: true,
  })
  skills: ThirdTable[];
}
