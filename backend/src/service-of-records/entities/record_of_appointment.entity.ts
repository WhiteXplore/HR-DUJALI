import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ServiceOfRecord } from './service-of-record.entity';

@Entity('record_of_appointment')
export class RecordOfAppointment {
  @PrimaryGeneratedColumn('increment')
  record_id: number;

  @Column({ nullable: false })
  period_from: string;

  @Column({ nullable: false })
  period_to: string;

  @Column({ nullable: false })
  roa_designation: string;

  @Column({ nullable: false })
  roa_sg: string;

  @Column({ nullable: false })
  roa_step: string;

  @Column({ nullable: false })
  roa_status: string;

  @Column({ nullable: false })
  roa_basic_salary: string;

  @Column({ nullable: false })
  roa_basic_salary_day: string;

  @Column({ nullable: false })
  office: string;

  @Column({ nullable: false })
  remarks: string;

  @ManyToOne(() => ServiceOfRecord, (service) => service.serviceRecords)
  @JoinColumn({ name: 'service_id' }) // foreign key column name in DB
  serviceOfRecord: ServiceOfRecord;

  @Column({ nullable: false })
  service_id: number; // Explicitly define the service_id column
}
