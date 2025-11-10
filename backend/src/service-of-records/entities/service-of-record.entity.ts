import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RecordOfAppointment } from './record_of_appointment.entity';

@Entity('service_of_record')
export class ServiceOfRecord {
  @PrimaryGeneratedColumn('increment')
  service_id: number;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  middle_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ type: 'date', nullable: false })
  birthdate: Date;

  @Column({ nullable: false })
  birth_place: string;

  @Column({ type: 'varchar', nullable: false })
  employee_id: string;

  @Column({ type: 'varchar', default: '' })
  department: string;

  // @Column({ type: 'blob', nullable: true })
  // pdf_file: Buffer;

  @OneToMany(() => RecordOfAppointment, (record) => record.serviceOfRecord, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  serviceRecords: RecordOfAppointment[];
}
