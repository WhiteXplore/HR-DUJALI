import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AttendanceRecord } from './entities/attendance-record.entity';
import { AttendanceRecordData } from './entities/attendance-record-data.entity';
import { CreateAttendanceRecordDto } from './dto/create-attendance-record.dto';
import { UpdateAttendanceRecordDto } from './dto/update-attendance-record.dto';

@Injectable()
export class AttendanceRecordService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(AttendanceRecord)
    private attendanceRecordRepository: Repository<AttendanceRecord>,

    @InjectRepository(AttendanceRecordData)
    private attendanceRecordDataRepository: Repository<AttendanceRecordData>,
  ) {}

  async create(createAttendanceRecordDto: CreateAttendanceRecordDto) {
    const { employee_id, name, records } = createAttendanceRecordDto;

    const attendanceRecord = this.attendanceRecordRepository.create({
      employee_id,
      name,
    });

    const savedRecord =
      await this.attendanceRecordRepository.save(attendanceRecord);

    const attendanceData = records.map((data) =>
      this.attendanceRecordDataRepository.create({
        ...data,
        attendanceRecord: savedRecord,
      }),
    );
    await this.attendanceRecordDataRepository.save(attendanceData);

    return this.findOne(savedRecord.attendance_id);
  }

  async createMany(dtos: CreateAttendanceRecordDto[]) {
    const entities: AttendanceRecord[] = dtos.map((dto) =>
      this.attendanceRecordRepository.create({
        employee_id: dto.employee_id,
        name: dto.name,
        records: dto.records,
      }),
    );

    return await this.attendanceRecordRepository.save(entities);
  }

  findAll() {
    return this.attendanceRecordRepository.find({ relations: ['records'] });
  }

  findOne(id: number) {
    return this.attendanceRecordRepository.findOne({
      where: { attendance_id: id },
      relations: ['records'],
    });
  }

  async getMonthlyAttendanceReports() {
    const sql = `
      CREATE OR REPLACE VIEW hris.vw_monthly_attendance_report AS
      SELECT 
    ar.employee_id,
    ar.name,
    DATE_FORMAT(ard.date, '%Y-%m') AS month_year, -- Month-Year

    COUNT(DISTINCT DATE_FORMAT(ard.date, '%Y-%m-%d')) AS total_days_present,

    ROUND(
        SUM(
            LEAST(
                GREATEST(
                    IF(ard.in_am IS NOT NULL AND ard.out_am IS NOT NULL, 
                        TIMESTAMPDIFF(SECOND, ard.in_am, ard.out_am), 0
                    ), 0
                )
                +
                GREATEST(
                    IF(ard.in_pm_24 IS NOT NULL AND ard.out_pm_24 IS NOT NULL, 
                        TIMESTAMPDIFF(SECOND, ard.in_pm_24, ard.out_pm_24), 0
                    ), 0
                ),
                8 * 3600
            )
        ) / 3600
    , 2) AS total_attendance_hours,

    SUM(
        CASE 
            WHEN (
                (ard.in_am IS NOT NULL AND STR_TO_DATE(ard.in_am, '%H:%i:%s') > '08:02:00')
                OR
                (ard.in_pm_24 IS NOT NULL AND STR_TO_DATE(ard.in_pm_24, '%H:%i:%s') > '13:02:00')
            )
            THEN 1 ELSE 0
        END
    ) AS total_late_days,

    SUM(
        CASE 
            WHEN ard.out_pm_24 < '17:00:00' AND ard.out_pm_24 IS NOT NULL 
                THEN TIMESTAMPDIFF(MINUTE, ard.out_pm_24, '17:00:00')
            ELSE 0 
        END
    ) AS total_undertime_minutes

FROM hris.attendance_records ar
JOIN hris.vw_attendance_24hr ard 
    ON ar.attendance_id = ard.attendance_id
WHERE ard.in_am IS NOT NULL 
   OR ard.in_pm_24 IS NOT NULL 
   OR ard.out_am IS NOT NULL 
   OR ard.out_pm_24 IS NOT NULL
GROUP BY ar.employee_id, ar.name, month_year
ORDER BY ar.name, month_year;

    `;
    return await this.dataSource.query(sql);
  }

  async getMonthlyAttendanceReport() {
    return await this.dataSource.query(
      'SELECT * FROM hris.vw_monthly_attendance_report;',
    );
  }

  async update(
    id: number,
    updateAttendanceRecordDto: UpdateAttendanceRecordDto,
  ) {
    const existingRecord = await this.attendanceRecordRepository.findOne({
      where: { attendance_id: id },
      relations: ['records'],
    });

    if (!existingRecord) throw new Error('Attendance record not found');

    const { employee_id, name, records } = updateAttendanceRecordDto;

    existingRecord.employee_id = employee_id ?? existingRecord.employee_id;
    existingRecord.name = name ?? existingRecord.name;

    if (records) {
      await this.attendanceRecordDataRepository.delete({
        attendanceRecord: { attendance_id: id },
      });

      const newData = records.map((data) =>
        this.attendanceRecordDataRepository.create({
          ...data,
          attendanceRecord: existingRecord,
        }),
      );
      await this.attendanceRecordDataRepository.save(newData);
    }

    return this.attendanceRecordRepository.save(existingRecord);
  }

  async remove(id: number) {
    await this.attendanceRecordRepository.delete(id);
    return { deleted: true };
  }
}
