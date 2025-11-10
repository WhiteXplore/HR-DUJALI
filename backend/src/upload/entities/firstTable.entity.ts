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
import { FourthTable } from './fourthTable.entity';
import { FifthTable } from './fifthTable.entity';
import { SixthTable } from './sixthTable.entity';
import { SeventhTable } from './seventhTable.entity';

@Entity('personal_table')
export class FirstTable {
  @PrimaryGeneratedColumn()
  first_table_id: number;

  @Column({ name: 'first_name' })
  first_name: string;

  @Column({ name: 'middle_name' })
  middle_name: string;

  @Column({ name: 'last_name' })
  last_name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => SecondTable, (secondTable) => secondTable.firstTable, {
    cascade: true,
  })
  secondTable: SecondTable[];

  @OneToMany(() => ThirdTable, (thirdTable) => thirdTable.firstTable, {
    cascade: true,
  })
  thirdTable: ThirdTable[];

  @OneToMany(() => FourthTable, (fourthTable) => fourthTable.firstTable, {
    cascade: true,
  })
  fourthTable: FourthTable[];

  @OneToMany(() => FifthTable, (fifthTable) => fifthTable.firstTable, {
    cascade: true,
  })
  fifthTable: FifthTable[];

  @OneToMany(() => SixthTable, (sixthTable) => sixthTable.firstTable, {
    cascade: true,
  })
  sixthTable: SixthTable[];

  @OneToMany(() => SeventhTable, (seventh) => seventh.firstTable)
  seventhTable: SeventhTable[];

  @Column({ name: 'suffix' })
  suffix: string;

  @Column({ name: 'birthdate' })
  birthdate: string;

  @Column({ name: 'place_of_birth' })
  place_of_birth: string;

  @Column({ name: 'gender' })
  gender: string;

  @Column({ name: 'civil_status' })
  civil_status: string;

  @Column({ name: 'height' })
  height: string;

  @Column({ name: 'weight' })
  weight: string;

  @Column({ name: 'blood_type' })
  blood_type: string;

  @Column({ name: 'citizenship' })
  citizenship: string;

  @Column({ name: 'is_dual_citizen', default: false })
  is_dual_citizen: boolean;

  // New fields
  @Column({ name: 'gsis_id' })
  gsis_id: string;

  @Column({ name: 'pagibig_id' })
  pagibig_id: string;

  @Column({ name: 'philhealth' })
  philhealth: string;

  @Column({ name: 'sss_number' })
  sss_number: string;

  @Column({ name: 'tin_number' })
  tin_number: string;

  @Column({ name: 'telephone_number' })
  telephone_number: string;

  @Column({ name: 'mobile_number' })
  mobile_number: string;

  @Column({ name: 'agency' })
  agency: string;

  // Address fields
  @Column({ name: 'house_number' })
  house_number: string;

  @Column({ name: 'street' })
  street: string;

  @Column({ name: 'subdivision' })
  subdivision: string;

  @Column({ name: 'barangay' })
  barangay: string;

  @Column({ name: 'municipality' })
  municipality: string;

  @Column({ name: 'province' })
  province: string;

  @Column({ name: 'zip_code' })
  zip_code: string;

  @Column({ name: 'same_house_number' })
  same_house_number: string;

  @Column({ name: 'same_street' })
  same_street: string;

  @Column({ name: 'same_subdivision' })
  same_subdivision: string;

  @Column({ name: 'same_barangay' })
  same_barangay: string;

  @Column({ name: 'same_municipality' })
  same_municipality: string;

  @Column({ name: 'same_province' })
  same_province: string;

  @Column({ name: 'same_zip_code' })
  same_zip_code: string;

  @Column({ name: 'employment_status', type: 'varchar', default: '' })
  employment_status: string;

  @Column({ name: 'employee_id', type: 'varchar', default: '' })
  employee_id: string;
}
