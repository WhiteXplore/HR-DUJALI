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

  @Column({ type: 'varchar', nullable: true })
  period_from: string | null;

  @Column({ type: 'varchar', nullable: true })
  period_to: string | null;

  @Column({ type: 'varchar', nullable: true })
  roa_designation: string | null;

  @Column({ type: 'varchar', nullable: true })
  roa_sg: string | null;

  @Column({ type: 'varchar', nullable: true })
  roa_step: string | null;

  @Column({ type: 'varchar', nullable: true })
  roa_status: string | null;

  @Column({ type: 'varchar', nullable: true })
  roa_basic_salary: string | null;

  @Column({ type: 'varchar', nullable: true })
  roa_basic_salary_day: string | null;

  @Column({ type: 'varchar', nullable: true })
  office: string | null;

  @Column({ type: 'varchar', nullable: true })
  remarks: string | null;

  @ManyToOne(() => ServiceOfRecord, (service) => service.serviceRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  serviceOfRecord: ServiceOfRecord;

  @Column({ nullable: true })
  service_id: number | null;
}
