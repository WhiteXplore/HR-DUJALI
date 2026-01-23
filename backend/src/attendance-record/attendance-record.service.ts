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
WITH RECURSIVE calendar AS (
    -- Generate all dates in the month based on the minimum date in records
    SELECT DATE_FORMAT(MIN(date), '%Y-%m-01') AS day_date
    FROM hris.attendance_records_data
    UNION ALL
    SELECT DATE_ADD(day_date, INTERVAL 1 DAY)
    FROM calendar
    WHERE DATE_ADD(day_date, INTERVAL 1 DAY) <= LAST_DAY((SELECT MIN(date) FROM hris.attendance_records_data))
),
weekdays AS (
    -- Only include Monday-Friday
    SELECT day_date
    FROM calendar
    WHERE DAYOFWEEK(day_date) NOT IN (1, 7)  -- 1=Sunday, 7=Saturday
)
SELECT 
    ar_main.employee_id,
    ar_main.name,
    MIN(ar_main.attendance_id) AS attendance_id,
    DATE_FORMAT(wd.day_date, '%Y-%m') AS month_year,

    -- Days present
    COUNT(DISTINCT CASE
        WHEN ard.in_am IS NOT NULL OR ard.in_pm IS NOT NULL
        THEN wd.day_date
    END) AS total_days_present,

    -- Days absent = weekdays without attendance or with all NULLs
    COUNT(DISTINCT CASE
        WHEN ard.attendance_id IS NULL 
             OR (ard.in_am IS NULL AND ard.out_am IS NULL AND ard.in_pm IS NULL AND ard.out_pm IS NULL)
        THEN wd.day_date
    END) AS total_days_absent,

    -- Total worked hours capped at 8h/day
    ROUND(
        SUM(
            LEAST(
                (
                    IF(ard.in_am IS NOT NULL AND ard.out_am IS NOT NULL,
                        TIME_TO_SEC(ard.out_am) - TIME_TO_SEC(ard.in_am),
                        0
                    )
                    +
                    IF(ard.in_pm IS NOT NULL AND ard.out_pm IS NOT NULL,
                        (CASE WHEN HOUR(ard.in_pm) < 12 THEN TIME_TO_SEC(ard.in_pm) + 12*3600 ELSE TIME_TO_SEC(ard.in_pm) END)
                        -
                        (CASE WHEN HOUR(ard.out_pm) < 12 THEN TIME_TO_SEC(ard.out_pm) + 12*3600 ELSE TIME_TO_SEC(ard.out_pm) END)
                        * -1,
                        0
                    )
                ),
                8*3600
            )
        ) / 3600, 2
    ) AS total_attendance_hours,
    -- Total undertime hours
-- Total undertime hours (FIXED 4H BLOCK LOGIC)
ROUND(
    SUM(
        CASE
            -- Full absence = not undertime
            WHEN ard.attendance_id IS NULL
              OR (ard.in_am IS NULL AND ard.out_am IS NULL
              AND ard.in_pm IS NULL AND ard.out_pm IS NULL)
            THEN 0

            ELSE
                -- AM undertime (4h if incomplete)
                (CASE
                    WHEN ard.in_am IS NOT NULL AND ard.out_am IS NOT NULL
                    THEN 0
                    ELSE 4
                END)

                +

                -- PM undertime (4h if incomplete)
                (CASE
                    WHEN ard.in_pm IS NOT NULL AND ard.out_pm IS NOT NULL
                    THEN 0
                    ELSE 4
                END)
        END
    ),
    2
) AS total_undertime_hours,



    -- Late days
    SUM(
        CASE 
            WHEN (ard.in_am IS NOT NULL AND ard.in_am > '08:02:00')
              OR (ard.in_pm IS NOT NULL AND ard.in_pm > '13:02:00')
            THEN 1 ELSE 0
        END
    ) AS total_late_days

FROM hris.attendance_records ar_main
-- Join weekdays to include all possible dates
CROSS JOIN weekdays wd
-- Left join attendance data per employee per day
LEFT JOIN hris.attendance_records_data ard
    ON ard.attendance_id = ar_main.attendance_id
   AND DATE(ard.date) = wd.day_date
GROUP BY ar_main.employee_id, ar_main.name, month_year
ORDER BY ar_main.employee_id, month_year;


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
