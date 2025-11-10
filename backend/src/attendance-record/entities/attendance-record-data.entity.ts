import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AttendanceRecord } from './attendance-record.entity';

@Entity('attendance_records_data')
export class AttendanceRecordData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time', nullable: true })
  in_am: string | null;

  @Column({ type: 'time', nullable: true })
  out_am: string | null;

  @Column({ type: 'time', nullable: true })
  in_pm: string | null;

  @Column({ type: 'time', nullable: true })
  out_pm: string | null;

  @ManyToOne(() => AttendanceRecord, (record) => record.records, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attendance_id' })
  attendanceRecord: AttendanceRecord;
}
