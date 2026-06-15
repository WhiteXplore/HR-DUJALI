import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FirstTable } from './entities/firstTable.entity';
import { SecondTable } from './entities/secondTable.entity';
import { ThirdTable } from './entities/thirdTable.entity';
import { FourthTable } from './entities/fourthTable.entity';
import { FifthTable } from './entities/fifthTable.entity';
import { SixthTable } from './entities/sixthTable.entity';
import { SeventhTable } from './entities/seventhTable.entity';
import { CreateUploadDto } from './dto/create-upload.dto';
import { DataSource } from 'typeorm';
@Injectable()
export class UploadService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(FirstTable)
    private readonly firstTableRepository: Repository<FirstTable>,

    @InjectRepository(SecondTable)
    private readonly secondTableRepository: Repository<SecondTable>,

    @InjectRepository(ThirdTable)
    private readonly thirdTableRepository: Repository<ThirdTable>,

    @InjectRepository(FourthTable)
    private readonly fourthTableRepository: Repository<FourthTable>,

    @InjectRepository(FifthTable)
    private readonly fifthTableRepository: Repository<FifthTable>,

    @InjectRepository(SixthTable)
    private readonly sixthTableRepository: Repository<SixthTable>,

    @InjectRepository(SeventhTable)
    private readonly seventhTableRepository: Repository<SeventhTable>,
  ) {}

  // The original create method (if needed)
  // Updated create method
  async create(createUploadDto: CreateUploadDto) {
    const {
      first_name,
      middle_name,
      last_name,
      suffix,
      birthdate,
      place_of_birth,
      gender,
      civil_status,
      height,
      weight,
      blood_type,
      citizenship,
      is_dual_citizen,
      gsis_id,
      pagibig_id,
      philhealth,
      sss_number,
      tin_number,
      telephone_number,
      mobile_number,
      agency,
      employment_status,
      employee_id,
      employment_type,

      // New address fields
      house_number,
      street,
      subdivision,
      barangay,
      municipality,
      province,
      zip_code,
      same_house_number,
      same_street,
      same_subdivision,
      same_barangay,
      same_municipality,
      same_province,
      same_zip_code,

      // Related records
      educationalRecords,
      civilRecords,
      learningRecords,
      specialSkillsRecords,
      nonAcadRecords,
      membershipRecords,
    } = createUploadDto;

    const firstTable = this.firstTableRepository.create({
      first_name,
      middle_name,
      last_name,
      suffix,
      birthdate,
      place_of_birth,
      gender,
      civil_status,
      height,
      weight,
      blood_type,
      citizenship,
      is_dual_citizen,
      gsis_id,
      pagibig_id,
      philhealth,
      sss_number,
      tin_number,
      telephone_number,
      mobile_number,
      agency,
      employment_status,
      employee_id,
      employment_type,

      // Include new address fields
      house_number,
      street,
      subdivision,
      barangay,
      municipality,
      province,
      zip_code,
      same_house_number,
      same_street,
      same_subdivision,
      same_barangay,
      same_municipality,
      same_province,
      same_zip_code,
    });

    const savedFirst = await this.firstTableRepository.save(firstTable);

    // Save related entities (no changes here)
    if (educationalRecords?.length) {
      const educationEntities = educationalRecords.map((record) =>
        this.secondTableRepository.create({
          ...record,
          firstTable: savedFirst,
        }),
      );
      await this.secondTableRepository.save(educationEntities);
    }

if (civilRecords?.length) {
  const civilEntities = civilRecords.map((record) =>
    this.fourthTableRepository.create({
      career_service: record.career_service || 'N/A',
      rating: record.rating || 'N/A',
      date_of_exam: record.date_of_exam || 'N/A',
      place_of_exam: record.place_of_exam || 'N/A',
      license_number: record.license_number || 'N/A',
      license_validity: record.license_validity || 'N/A',
      firstTable: savedFirst,
    }),
  );

  await this.fourthTableRepository.save(civilEntities);
}

    if (learningRecords?.length) {
      const learningEntities = learningRecords.map((record) =>
        this.fifthTableRepository.create({
          title_learning_development: record.title_learning_development,
          ld_from: record.ld_from,
          ld_to: record.ld_to,
          ld_number_of_hours: record.ld_number_of_hours,
          type_of_ld: record.type_of_ld,
          ld_conducted_sponsor: record.ld_conducted_sponsor,
          firstTable: savedFirst,
        }),
      );
      await this.fifthTableRepository.save(learningEntities);
    }

    if (specialSkillsRecords?.length) {
      const specialEntities = specialSkillsRecords.map((record) =>
        this.thirdTableRepository.create({
          special_skills: record.special_skills,
          firstTable: savedFirst,
        }),
      );
      await this.thirdTableRepository.save(specialEntities);
    }

    if (nonAcadRecords?.length) {
      const nonAcadEntities = nonAcadRecords.map((record) =>
        this.sixthTableRepository.create({
          non_academic: record.non_academic,
          firstTable: savedFirst,
        }),
      );
      await this.sixthTableRepository.save(nonAcadEntities);
    }

    if (membershipRecords?.length) {
      const membershipEntities = membershipRecords.map((record) =>
        this.seventhTableRepository.create({
          membership: record.membership,
          firstTable: savedFirst,
        }),
      );
      await this.seventhTableRepository.save(membershipEntities);
    }

    return {
      message: 'Upload created successfully',
      id: savedFirst.first_table_id,
    };
  }

  async findByEmployeeId(employeeId: string) {
    const record = await this.firstTableRepository.findOne({
      where: { employee_id: employeeId },
    });

    if (!record) {
      throw new NotFoundException(
        `Record with Employee ID ${employeeId} not found`,
      );
    }

    return record;
  }

  async findAll() {
    const records = await this.firstTableRepository.find({
      relations: [
        'secondTable',
        'thirdTable',
        'fourthTable',
        'fifthTable',
        'sixthTable',
        'seventhTable',
      ],
    });

    return records;
  }

  async findById(id: number) {
    try {
      const record = await this.firstTableRepository.findOne({
        where: { first_table_id: id },
        relations: [
          'secondTable',
          'thirdTable',
          'fourthTable',
          'fifthTable',
          'sixthTable',
          'seventhTable',
        ],
      });

      if (!record) {
        throw new NotFoundException(`Record with ID ${id} not found`);
      }

      return record;
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  async remove(id: number) {
    const record = await this.firstTableRepository.findOne({
      where: { first_table_id: id },
      relations: [
        'secondTable',
        'thirdTable',
        'fourthTable',
        'fifthTable',
        'sixthTable',
        'seventhTable',
      ],
    });

    if (!record) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }

    // Delete related entities first
    if (record.secondTable?.length) {
      await this.secondTableRepository.remove(record.secondTable);
    }

    if (record.thirdTable?.length) {
      await this.thirdTableRepository.remove(record.thirdTable);
    }

    if (record.fourthTable?.length) {
      await this.fourthTableRepository.remove(record.fourthTable);
    }

    if (record.fifthTable?.length) {
      await this.fifthTableRepository.remove(record.fifthTable);
    }

    if (record.sixthTable?.length) {
      await this.sixthTableRepository.remove(record.sixthTable);
    }

    if (record.seventhTable?.length) {
      await this.seventhTableRepository.remove(record.seventhTable);
    }

    // Finally, delete the main record
    await this.firstTableRepository.remove(record);

    return { message: `Record with ID ${id} deleted successfully` };
  }

  async getEmployeeDetailsFromView() {
    return await this.dataSource.query(
      `SELECT * FROM hris.vw_employee_details`,
    );
  }

  async getEligibleEmployeesFromView() {
    const rawData = await this.dataSource.query(
      `SELECT * FROM hris.vw_employee_details;

`,
    );
    return rawData;
  }

  async updateImage(id: number, filename: string) {
    // Find the existing record
    const record = await this.firstTableRepository.findOne({
      where: { first_table_id: id },
    });
    if (!record) {
      throw new Error('Record not found');
    }

    // Update only the image_filename
    record.image_filename = filename;

    return this.firstTableRepository.save(record);
  }

  // Inside UploadService
  async updateFifthTable(
    employeeId: number,
    learningRecords: Partial<FifthTable>[],
  ) {
    // Fetch the employee with their learning records
    const existing = await this.firstTableRepository.findOne({
      where: { first_table_id: employeeId },
      relations: ['fifthTable'],
    });

    if (!existing) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    // ⚡ Don’t delete existing records, just add new ones
    const newLearningEntities = learningRecords.map((record) =>
      this.fifthTableRepository.create({
        title_learning_development: record.title_learning_development,
        ld_from: record.ld_from,
        ld_to: record.ld_to,
        ld_number_of_hours: record.ld_number_of_hours,
        type_of_ld: record.type_of_ld,
        ld_conducted_sponsor: record.ld_conducted_sponsor,
        firstTable: existing,
      }),
    );

    await this.fifthTableRepository.save(newLearningEntities);

    return {
      message: `Learning records appended successfully for employee ID ${employeeId}`,
      count: newLearningEntities.length,
    };
  }

  // upload.service.ts
  // async updateFifthTable(
  //   employeeId: number,
  //   learningRecords: Partial<FifthTable>[],
  // ) {
  //   const existing = await this.firstTableRepository.findOne({
  //     where: { first_table_id: employeeId },
  //     relations: ['fifthTable'],
  //   });

  //   if (!existing) {
  //     throw new NotFoundException(`Employee with ID ${employeeId} not found`);
  //   }

  //   // Optional: remove existing records for replacement
  //   if (existing.fifthTable?.length) {
  //     await this.fifthTableRepository.remove(existing.fifthTable);
  //   }

  //   const newEntities = learningRecords.map((record) =>
  //     this.fifthTableRepository.create({
  //       ...record,
  //       firstTable: existing,
  //     }),
  //   );

  //   await this.fifthTableRepository.save(newEntities);

  //   return {
  //     message: `Learning records updated successfully for employee ID ${employeeId}`,
  //     count: newEntities.length,
  //   };
  // }

  async update(id: number, updateUploadDto: CreateUploadDto) {
    const existing = await this.firstTableRepository.findOne({
      where: { first_table_id: id },
      relations: [
        'secondTable',
        'thirdTable',
        'fourthTable',
        'fifthTable',
        'sixthTable',
        'seventhTable',
      ],
    });

    if (!existing) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }

    // 🔹 Update main personal fields
    this.firstTableRepository.merge(existing, updateUploadDto);
    const updatedFirst = await this.firstTableRepository.save(existing);

    // 🔹 Update Educational Background
    if (Array.isArray(updateUploadDto.educationalRecords)) {
      await this.secondTableRepository.delete({
        firstTable: { first_table_id: id },
      });

      if (updateUploadDto.educationalRecords.length > 0) {
        const newEdu = updateUploadDto.educationalRecords.map((record) =>
          this.secondTableRepository.create({
            ...record,
            firstTable: updatedFirst,
          }),
        );
        await this.secondTableRepository.save(newEdu);
      }
    }

    // 🔹 Update Civil Service Records
    if (Array.isArray(updateUploadDto.civilRecords)) {
      await this.fourthTableRepository.delete({
        firstTable: { first_table_id: id },
      });

      if (updateUploadDto.civilRecords.length > 0) {
        const newCivil = updateUploadDto.civilRecords.map((record) =>
          this.fourthTableRepository.create({
            ...record,
            firstTable: updatedFirst,
          }),
        );
        await this.fourthTableRepository.save(newCivil);
      }
    }

    // 🔹 Update Learning Records (append mode)
    if (Array.isArray(updateUploadDto.learningRecords)) {
      // Delete all existing learning records for this employee
      await this.fifthTableRepository.delete({
        firstTable: { first_table_id: id },
      });

      // Save the new array (including only remaining rows)
      if (updateUploadDto.learningRecords.length > 0) {
        const entities = updateUploadDto.learningRecords.map((record) =>
          this.fifthTableRepository.create({
            ...record,
            firstTable: updatedFirst,
          }),
        );
        await this.fifthTableRepository.save(entities);
      }
    }

    // 🔹 Update Special Skills
    if (Array.isArray(updateUploadDto.specialSkillsRecords)) {
      await this.thirdTableRepository.delete({
        firstTable: { first_table_id: id },
      });

      if (updateUploadDto.specialSkillsRecords.length > 0) {
        const newSkills = updateUploadDto.specialSkillsRecords.map((record) =>
          this.thirdTableRepository.create({
            ...record,
            firstTable: updatedFirst,
          }),
        );
        await this.thirdTableRepository.save(newSkills);
      }
    }

    // 🔹 Update Non-Academic Records
    if (Array.isArray(updateUploadDto.nonAcadRecords)) {
      await this.sixthTableRepository.delete({
        firstTable: { first_table_id: id },
      });

      if (updateUploadDto.nonAcadRecords.length > 0) {
        const newNonAcad = updateUploadDto.nonAcadRecords.map((record) =>
          this.sixthTableRepository.create({
            ...record,
            firstTable: updatedFirst,
          }),
        );
        await this.sixthTableRepository.save(newNonAcad);
      }
    }

    // 🔹 Update Memberships
    if (Array.isArray(updateUploadDto.membershipRecords)) {
      await this.seventhTableRepository.delete({
        firstTable: { first_table_id: id },
      });

      if (updateUploadDto.membershipRecords.length > 0) {
        const newMemberships = updateUploadDto.membershipRecords.map((record) =>
          this.seventhTableRepository.create({
            ...record,
            firstTable: updatedFirst,
          }),
        );
        await this.seventhTableRepository.save(newMemberships);
      }
    }

    return {
      message: `Record with ID ${id} updated successfully`,
      id: updatedFirst.first_table_id,
    };
  }

  async uploadEmployee(createUploadDtos: CreateUploadDto[]) {
    const results: { message: string; id: number }[] = [];

    for (const createUploadDto of createUploadDtos) {
      const {
        first_name,
        middle_name,
        last_name,
        suffix,
        birthdate,
        place_of_birth,
        gender,
        civil_status,
        height,
        weight,
        blood_type,
        citizenship,
        is_dual_citizen,
        gsis_id,
        pagibig_id,
        philhealth,
        sss_number,
        tin_number,
        telephone_number,
        mobile_number,
        agency,

        house_number,
        street,
        subdivision,
        barangay,
        municipality,
        province,
        zip_code,
        same_house_number,
        same_street,
        same_subdivision,
        same_barangay,
        same_municipality,
        same_province,
        same_zip_code,

        educationalRecords,
        civilRecords,
        learningRecords,
        specialSkillsRecords,
        nonAcadRecords,
        membershipRecords,
      } = createUploadDto;

      const firstTable = this.firstTableRepository.create({
        first_name,
        middle_name,
        last_name,
        suffix,
        birthdate,
        place_of_birth,
        gender,
        civil_status,
        height,
        weight,
        blood_type,
        citizenship,
        is_dual_citizen,
        gsis_id,
        pagibig_id,
        philhealth,
        sss_number,
        tin_number,
        telephone_number,
        mobile_number,
        agency,

        house_number,
        street,
        subdivision,
        barangay,
        municipality,
        province,
        zip_code,
        same_house_number,
        same_street,
        same_subdivision,
        same_barangay,
        same_municipality,
        same_province,
        same_zip_code,
      });

      const savedFirst = await this.firstTableRepository.save(firstTable);

      if (educationalRecords?.length) {
        const educationEntities = educationalRecords.map((record) =>
          this.secondTableRepository.create({
            ...record,
            firstTable: savedFirst,
          }),
        );
        await this.secondTableRepository.save(educationEntities);
      }

      if (civilRecords?.length) {
        const civilEntities = civilRecords.map((record) =>
          this.fourthTableRepository.create({
            ...record,
            firstTable: savedFirst,
          }),
        );
        await this.fourthTableRepository.save(civilEntities);
      }

      if (learningRecords?.length) {
        const learningEntities = learningRecords.map((record) =>
          this.fifthTableRepository.create({
            ...record,
            firstTable: savedFirst,
          }),
        );
        await this.fifthTableRepository.save(learningEntities);
      }

      if (specialSkillsRecords?.length) {
        const specialEntities = specialSkillsRecords.map((record) =>
          this.thirdTableRepository.create({
            ...record,
            firstTable: savedFirst,
          }),
        );
        await this.thirdTableRepository.save(specialEntities);
      }

      if (nonAcadRecords?.length) {
        const nonAcadEntities = nonAcadRecords.map((record) =>
          this.sixthTableRepository.create({
            ...record,
            firstTable: savedFirst,
          }),
        );
        await this.sixthTableRepository.save(nonAcadEntities);
      }

      if (membershipRecords?.length) {
        const membershipEntities = membershipRecords.map((record) =>
          this.seventhTableRepository.create({
            ...record,
            firstTable: savedFirst,
          }),
        );
        await this.seventhTableRepository.save(membershipEntities);
      }

      results.push({
        message: 'Upload created successfully',
        id: savedFirst.first_table_id,
      });
    }

    return results;
  }
}
