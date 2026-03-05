import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RecordOfAppointment } from './record_of_appointment.entity';

@Entity('service_of_record')
export class ServiceOfRecord {
  @PrimaryGeneratedColumn('increment')
  service_id: number;

  @Column({ type: 'varchar', nullable: true })
  first_name: string | null;

  @Column({ type: 'varchar', nullable: true })
  middle_name: string | null;

  @Column({ type: 'varchar', nullable: true })
  last_name: string | null;

  @Column({ type: 'date', nullable: true })
  birthdate: Date | null;

  @Column({ type: 'varchar', nullable: true })
  birth_place: string | null;

  @Column({ type: 'varchar', nullable: true, unique: true })
  employee_id: string | null;

  @Column({ type: 'varchar', nullable: true })
  department: string | null;

  @Column({ type: 'varchar', nullable: true })
  service_status: string | null;

  @Column({ type: 'varchar', nullable: true })
  edited_by: string | null;

  @OneToMany(() => RecordOfAppointment, (record) => record.serviceOfRecord, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  serviceRecords: RecordOfAppointment[];
}
