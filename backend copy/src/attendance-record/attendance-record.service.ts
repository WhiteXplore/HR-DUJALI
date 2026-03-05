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
    SELECT DATE_FORMAT(MIN(date), '%Y-%m-01') AS day_date
    FROM hris.attendance_records_data

    UNION ALL

    SELECT DATE_ADD(day_date, INTERVAL 1 DAY)
    FROM calendar
    WHERE DATE_ADD(day_date, INTERVAL 1 DAY)
          <= (SELECT DATE(MAX(date)) FROM hris.attendance_records_data)
),
weekdays AS (
    SELECT day_date
    FROM calendar
    WHERE DAYOFWEEK(day_date) NOT IN (1, 7)
)
SELECT 
    ar_main.employee_id,
    ar_main.name,
    MIN(ar_main.attendance_id) AS attendance_id,
    DATE_FORMAT(wd.day_date, '%Y-%m') AS month_year,

    -- Total days present (any punch present counts)
    COUNT(DISTINCT CASE
        WHEN ard.in_am IS NOT NULL OR ard.in_pm IS NOT NULL
        THEN wd.day_date
    END) AS total_days_present,

    -- Total days absent
    COUNT(DISTINCT wd.day_date)
    - COUNT(DISTINCT CASE
        WHEN ard.in_am IS NOT NULL OR ard.in_pm IS NOT NULL
        THEN wd.day_date
      END) AS total_days_absent,

    -- Total Attendance Hours (capped 4 hours per half-day)
    ROUND(
        SUM(
            CASE
                WHEN ard.in_am IS NOT NULL AND ard.out_am IS NOT NULL
                THEN LEAST(TIME_TO_SEC(ard.out_am) - TIME_TO_SEC(ard.in_am), 4*3600)
                ELSE 0
            END
            +
            CASE
                WHEN ard.in_pm IS NOT NULL AND ard.out_pm IS NOT NULL
                THEN LEAST(
                    TIME_TO_SEC(
                        CASE WHEN HOUR(ard.out_pm) < 12 THEN ADDTIME(ard.out_pm, '12:00:00') ELSE ard.out_pm END
                    )
                    -
                    TIME_TO_SEC(
                        CASE WHEN HOUR(ard.in_pm) < 12 THEN ADDTIME(ard.in_pm, '12:00:00') ELSE ard.in_pm END
                    ),
                    4*3600
                )
                ELSE 0
            END
        ) / 3600, 2
    ) AS total_attendance_hours,

    -- Total Actual Work Hours (not capped)
    ROUND(
        SUM(
            CASE
                WHEN ard.in_am IS NOT NULL AND ard.out_am IS NOT NULL
                THEN TIME_TO_SEC(ard.out_am) - TIME_TO_SEC(ard.in_am)
                ELSE 0
            END
            +
            CASE
                WHEN ard.in_pm IS NOT NULL AND ard.out_pm IS NOT NULL
                THEN TIME_TO_SEC(
                        CASE WHEN HOUR(ard.out_pm) < 12 THEN ADDTIME(ard.out_pm, '12:00:00') ELSE ard.out_pm END
                     )
                     -
                     TIME_TO_SEC(
                        CASE WHEN HOUR(ard.in_pm) < 12 THEN ADDTIME(ard.in_pm, '12:00:00') ELSE ard.in_pm END
                     )
                ELSE 0
            END
        ) / 3600, 2
    ) AS total_actual_work_hours,

    -- Total Undertime Hours (only if both AM and PM exist)
    ROUND(
        SUM(
            CASE
                WHEN ard.in_am IS NOT NULL AND ard.out_am IS NOT NULL
                 AND ard.in_pm IS NOT NULL AND ard.out_pm IS NOT NULL THEN
                    GREATEST(
                        8 - (
                            (TIME_TO_SEC(ard.out_am) - TIME_TO_SEC(ard.in_am))
                            +
                            (TIME_TO_SEC(
                                CASE WHEN HOUR(ard.out_pm) < 12 THEN ADDTIME(ard.out_pm, '12:00:00') ELSE ard.out_pm END
                             )
                             -
                             TIME_TO_SEC(
                                CASE WHEN HOUR(ard.in_pm) < 12 THEN ADDTIME(ard.in_pm, '12:00:00') ELSE ard.in_pm END
                             )
                            )
                        ) / 3600,
                        0
                    )
                ELSE 0
            END
        ), 2
    ) AS total_undertime_hours,
    
    -- Total Overtime Hours
ROUND(
    GREATEST(
        SUM(
            CASE
                WHEN ard.in_am IS NOT NULL AND ard.out_am IS NOT NULL
                     AND ard.in_pm IS NOT NULL AND ard.out_pm IS NOT NULL
                THEN 
                    ((TIME_TO_SEC(ard.out_am) - TIME_TO_SEC(ard.in_am))
                     +
                     (TIME_TO_SEC(
                         CASE WHEN HOUR(ard.out_pm) < 12 THEN ADDTIME(ard.out_pm,'12:00:00') ELSE ard.out_pm END
                     ) - TIME_TO_SEC(
                         CASE WHEN HOUR(ard.in_pm) < 12 THEN ADDTIME(ard.in_pm,'12:00:00') ELSE ard.in_pm END
                     ))
                    ) / 3600 - 8
                WHEN (ard.in_am IS NOT NULL AND ard.out_am IS NOT NULL
                      AND (ard.in_pm IS NULL OR ard.out_pm IS NULL))
                      OR (ard.in_pm IS NOT NULL AND ard.out_pm IS NOT NULL
                          AND (ard.in_am IS NULL OR ard.out_am IS NULL))
                THEN 
                    ((CASE WHEN ard.in_am IS NOT NULL AND ard.out_am IS NOT NULL
                           THEN TIME_TO_SEC(ard.out_am) - TIME_TO_SEC(ard.in_am)
                           ELSE 0 END
                     +
                     CASE WHEN ard.in_pm IS NOT NULL AND ard.out_pm IS NOT NULL
                           THEN TIME_TO_SEC(
                                    CASE WHEN HOUR(ard.out_pm)<12 THEN ADDTIME(ard.out_pm,'12:00:00') ELSE ard.out_pm END
                                )
                                -
                                TIME_TO_SEC(
                                    CASE WHEN HOUR(ard.in_pm)<12 THEN ADDTIME(ard.in_pm,'12:00:00') ELSE ard.in_pm END
                                )
                           ELSE 0 END
                    ) / 3600 - 4)  -- Half day expected = 4h
                ELSE 0
            END
        ),
        0
    ), 2
) AS total_overtime_hours,


    -- Total Late Days
    SUM(
        CASE 
            WHEN (ard.in_am IS NOT NULL AND ard.in_am > '08:02:00')
              OR (ard.in_pm IS NOT NULL AND (
                    CASE WHEN HOUR(ard.in_pm) < 12 THEN ADDTIME(ard.in_pm, '12:00:00') ELSE ard.in_pm END
                 ) > '13:02:00')
            THEN 1 ELSE 0
        END
    ) AS total_late_days,

    -- Official Work Hours per Month (number of weekdays * 8h)
    COUNT(DISTINCT wd.day_date) * 8 AS official_work_hours_per_month,

    -- Final Total Days Present (full day = 1, half day = 0.5 if only AM or PM complete)
    ROUND(
        SUM(
            CASE
                WHEN ard.in_am IS NOT NULL AND ard.out_am IS NOT NULL
                 AND ard.in_pm IS NOT NULL AND ard.out_pm IS NOT NULL THEN 1
                WHEN (ard.in_am IS NOT NULL AND ard.out_am IS NOT NULL
                      AND (ard.in_pm IS NULL OR ard.out_pm IS NULL))
                  OR (ard.in_pm IS NOT NULL AND ard.out_pm IS NOT NULL
                      AND (ard.in_am IS NULL OR ard.out_am IS NULL))
                THEN 0.5
                ELSE 0
            END
        ), 2
    ) AS total_days_present_final

FROM hris.attendance_records ar_main
CROSS JOIN weekdays wd
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
