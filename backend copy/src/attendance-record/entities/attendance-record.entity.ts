import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AttendanceRecordData } from './attendance-record-data.entity';

@Entity('attendance_records')
export class AttendanceRecord {
  @PrimaryGeneratedColumn()
  attendance_id: number;

  @Column()
  employee_id: string;

  @Column()
  name: string;

  @OneToMany(() => AttendanceRecordData, (data) => data.attendanceRecord, {
    cascade: true,
  })
  records: AttendanceRecordData[];
}
