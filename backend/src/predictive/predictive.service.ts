import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PredictiveService {
  constructor(
    private readonly httpService: HttpService,
    private readonly dataSource: DataSource,
  ) {}

  async refreshSeminarView(): Promise<void> {
    const sql = `
CREATE OR REPLACE VIEW hris.vw_employee_details AS
SELECT 
    s.employee_id,
    p.first_table_id COLLATE utf8mb4_unicode_ci AS first_table_id,           
    s.first_name COLLATE utf8mb4_unicode_ci AS first_name,
    s.middle_name COLLATE utf8mb4_unicode_ci AS middle_name,
    s.last_name COLLATE utf8mb4_unicode_ci AS last_name,
    s.department COLLATE utf8mb4_unicode_ci AS department,
    p.gender COLLATE utf8mb4_unicode_ci AS gender,
    p.employment_status COLLATE utf8mb4_unicode_ci AS employment_status,

    -- Birthdate and age
    s.birthdate,
    s.birth_place COLLATE utf8mb4_unicode_ci AS birth_place,
    TIMESTAMPDIFF(YEAR, s.birthdate, CURDATE()) AS age,

    -- Total years of service
    ROUND(SUM(
        DATEDIFF(
            CASE 
                WHEN r.period_to COLLATE utf8mb4_unicode_ci = 'present' 
                THEN CURDATE() 
                ELSE STR_TO_DATE(r.period_to, '%m/%d/%Y')
            END,
            STR_TO_DATE(r.period_from, '%m/%d/%Y')
        )
    ) / 365, 2) AS total_years_experience,

    -- Highest education level
    MAX(e.level COLLATE utf8mb4_unicode_ci) AS level,

    -- Latest ROA designation and status
    latest_roa.roa_designation COLLATE utf8mb4_unicode_ci AS present_designation,
    latest_roa.roa_status COLLATE utf8mb4_unicode_ci AS current_roa_status,

    -- Learning development info
    COALESCE(MAX(lt.ld_number_of_hours), 0) AS total_ld_hours_rendered,
    COALESCE(MAX(dld.total_unique_ld_titles), 0) AS total_count_of_learning_development,

    -- Total attendance hours in 24-hour format
    COALESCE(MAX(att_hours.total_attendance_hours), 0) AS total_attendance_hours

FROM hris.service_of_record s
JOIN hris.personal_table p 
    ON s.employee_id = p.employee_id

LEFT JOIN hris.record_of_appointment r
    ON r.service_id = s.service_id

-- Highest education ranking
LEFT JOIN (
    SELECT 
        first_table_id COLLATE utf8mb4_unicode_ci AS first_table_id, 
        MAX(CASE 
            WHEN level COLLATE utf8mb4_unicode_ci = 'DOCTORATE' THEN 5
            WHEN level COLLATE utf8mb4_unicode_ci = 'MASTERAL' THEN 4
            WHEN level COLLATE utf8mb4_unicode_ci = 'COLLEGE' THEN 3
            WHEN level COLLATE utf8mb4_unicode_ci = 'VOCATIONAL/TRADE COURSE' THEN 2
            WHEN level COLLATE utf8mb4_unicode_ci = 'SECONDARY' THEN 1
            WHEN level COLLATE utf8mb4_unicode_ci = 'ELEMENTARY' THEN 0
            ELSE -1
        END) AS max_level_rank
    FROM hris.educational_table
    GROUP BY first_table_id COLLATE utf8mb4_unicode_ci
) AS edu_rank 
    ON p.first_table_id COLLATE utf8mb4_unicode_ci = edu_rank.first_table_id

LEFT JOIN hris.educational_table e
    ON e.first_table_id COLLATE utf8mb4_unicode_ci = edu_rank.first_table_id
    AND (
        CASE 
            WHEN e.level COLLATE utf8mb4_unicode_ci = 'DOCTORATE' THEN 5
            WHEN e.level COLLATE utf8mb4_unicode_ci = 'MASTERAL' THEN 4
            WHEN e.level COLLATE utf8mb4_unicode_ci = 'COLLEGE' THEN 3
            WHEN e.level COLLATE utf8mb4_unicode_ci = 'VOCATIONAL/TRADE COURSE' THEN 2
            WHEN e.level COLLATE utf8mb4_unicode_ci = 'SECONDARY' THEN 1
            WHEN e.level COLLATE utf8mb4_unicode_ci = 'ELEMENTARY' THEN 0
            ELSE -1
        END
    ) = edu_rank.max_level_rank

-- Latest ROA info
LEFT JOIN (
    SELECT ra1.service_id, ra1.roa_designation, ra1.roa_status
    FROM hris.record_of_appointment ra1
    JOIN (
        SELECT service_id, MAX(
            CASE 
                WHEN period_to COLLATE utf8mb4_unicode_ci = 'present' THEN CURDATE()
                ELSE STR_TO_DATE(period_to, '%m/%d/%Y')
            END
        ) AS latest_period
        FROM hris.record_of_appointment
        WHERE roa_designation IS NOT NULL
          AND (period_to REGEXP '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' OR period_to COLLATE utf8mb4_unicode_ci = 'present')
        GROUP BY service_id
    ) ra2 
        ON ra1.service_id = ra2.service_id
       AND (
            CASE 
                WHEN ra1.period_to COLLATE utf8mb4_unicode_ci = 'present' THEN CURDATE()
                ELSE STR_TO_DATE(ra1.period_to, '%m/%d/%Y')
            END
       ) = ra2.latest_period
) latest_roa ON latest_roa.service_id = s.service_id

-- Aggregate LD hours
LEFT JOIN (
    SELECT first_table_id COLLATE utf8mb4_unicode_ci AS first_table_id, 
           SUM(ld_number_of_hours) AS ld_number_of_hours
    FROM hris.learning_table
    GROUP BY first_table_id COLLATE utf8mb4_unicode_ci
) lt ON lt.first_table_id = p.first_table_id COLLATE utf8mb4_unicode_ci

-- Count distinct LD titles
LEFT JOIN (
    SELECT first_table_id COLLATE utf8mb4_unicode_ci AS first_table_id, 
           COUNT(DISTINCT title_learning_development COLLATE utf8mb4_unicode_ci) AS total_unique_ld_titles
    FROM hris.learning_table
    GROUP BY first_table_id COLLATE utf8mb4_unicode_ci
) dld ON dld.first_table_id = p.first_table_id COLLATE utf8mb4_unicode_ci

-- Attendance hours in 24-hour format
LEFT JOIN (
    SELECT 
        ar.employee_id,
        SUM(
            LEAST(
                IF(ard.in_am IS NOT NULL AND ard.out_am IS NOT NULL, TIMESTAMPDIFF(SECOND, ard.in_am, ard.out_am), 0) +
                IF(ard.in_pm IS NOT NULL AND ard.out_pm IS NOT NULL,
                    TIMESTAMPDIFF(
                        SECOND,
                        CASE WHEN TIME_FORMAT(ard.in_pm, '%H:%i:%s') < '12:00:00' THEN ADDTIME(ard.in_pm, '12:00:00') ELSE ard.in_pm END,
                        CASE WHEN TIME_FORMAT(ard.out_pm, '%H:%i:%s') < '12:00:00' THEN ADDTIME(ard.out_pm, '12:00:00') ELSE ard.out_pm END
                    ),
                    0
                ),
                8*3600
            )
        ) / 3600 AS total_attendance_hours
    FROM hris.attendance_records_data ard
    JOIN hris.attendance_records ar
        ON ard.attendance_id = ar.attendance_id
    GROUP BY ar.employee_id
) att_hours ON att_hours.employee_id = p.employee_id

GROUP BY 
    s.employee_id,
    p.first_table_id COLLATE utf8mb4_unicode_ci,
    s.first_name COLLATE utf8mb4_unicode_ci, 
    s.middle_name COLLATE utf8mb4_unicode_ci, 
    s.last_name COLLATE utf8mb4_unicode_ci, 
    s.department COLLATE utf8mb4_unicode_ci,
    p.gender COLLATE utf8mb4_unicode_ci,  
    p.employment_status COLLATE utf8mb4_unicode_ci,
    s.birthdate,
    s.birth_place COLLATE utf8mb4_unicode_ci,
    latest_roa.roa_designation COLLATE utf8mb4_unicode_ci,
    latest_roa.roa_status COLLATE utf8mb4_unicode_ci;




      `;

    await this.dataSource.query(sql);
  }

  async fetchEmployeesFromView(): Promise<any[]> {
    const query = `SELECT * FROM hris.vw_employee_details;`;
    const employees = await this.dataSource.query(query);
    return employees;
  }

  async getPrediction(employees: any[]) {
    const url = 'https://humanresourcedujali.pythonanywhere.com/predict';
    // const url = 'http://127.0.0.1:5000/predict';

    const formattedEmployees = employees.map((emp) => ({
      first_name: emp.first_name,
      last_name: emp.last_name,
      birthdate: emp.birthdate,
      age: Number(emp.age), // number as expected
      place_of_birth: emp.place_of_birth,
      level: emp.level,
      present_designation: emp.present_designation,
      total_years_experience: Number(emp.total_years_experience), // fix here
    }));

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, formattedEmployees, {
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const cleanedPrediction = response.data.map((item: any) => {
        const { eligible, recommended_seminars, employee } = item;
        delete employee.total_years_experience;

        return {
          eligible,
          recommended_seminars,
          employee,
        };
      });

      return {
        employees: formattedEmployees,
        predictions: cleanedPrediction,
      };
    } catch (error) {
      console.error(
        'Prediction API call failed:',
        error.response?.data || error.message,
      );
      throw new Error(`Prediction API call failed: ${error.message}`);
    }
  }
  async getPromotionData() {
    const rawData = await this.dataSource.query(
      'SELECT * FROM hris.vw_employee_promotion;',
    );
    return rawData;
  }

  async fetchAndPredict() {
    try {
      const employees = await this.fetchEmployeesFromView();
      const predictionData = await this.getPrediction(employees);
      return predictionData;
    } catch (error) {
      console.error('Error in fetchAndPredict:', error);
      throw error;
    }
  }
}
