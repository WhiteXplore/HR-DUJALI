import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceOfRecord } from './entities/service-of-record.entity';
import { RecordOfAppointment } from './entities/record_of_appointment.entity';
import { CreateServiceOfRecordDto } from './dto/create-service-of-record.dto';
import { UpdateServiceOfRecordDto } from './dto/update-service-of-record.dto';

@Injectable()
export class ServiceOfRecordsService {
  constructor(
    @InjectRepository(ServiceOfRecord)
    private serviceOfRecordRepository: Repository<ServiceOfRecord>,
    @InjectRepository(RecordOfAppointment)
    private recordOfAppointmentRepository: Repository<RecordOfAppointment>,
  ) {}

  async create(
    createServiceOfRecordDto: CreateServiceOfRecordDto,
  ): Promise<ServiceOfRecord> {
    const serviceOfRecord = this.serviceOfRecordRepository.create(
      createServiceOfRecordDto,
    );
    return this.serviceOfRecordRepository.save(serviceOfRecord);
  }

  async createMany(
    employees: CreateServiceOfRecordDto[],
  ): Promise<ServiceOfRecord[]> {
    const createdEmployees: ServiceOfRecord[] = [];

    for (const empDto of employees) {
      // Check if an employee with the same employee_id already exists
      const existing = await this.serviceOfRecordRepository.findOne({
        where: { employee_id: empDto.employee_id },
      });

      if (existing) {
        // Skip this employee to avoid duplicates
        continue;
      }

      // Create the parent employee record
      const serviceOfRecord = this.serviceOfRecordRepository.create({
        ...empDto,
        serviceRecords:
          empDto.serviceRecords?.map((r) =>
            this.recordOfAppointmentRepository.create(r),
          ) || [],
      });

      const savedEmployee =
        await this.serviceOfRecordRepository.save(serviceOfRecord);
      createdEmployees.push(savedEmployee);
    }

    return createdEmployees;
  }

  async findAll(): Promise<ServiceOfRecord[]> {
    return this.serviceOfRecordRepository.find({
      relations: ['serviceRecords'],
    });
  }

  async findOne(id: number): Promise<ServiceOfRecord> {
    const serviceOfRecord = await this.serviceOfRecordRepository.findOne({
      where: { service_id: id },
      relations: ['serviceRecords'],
    });

    if (!serviceOfRecord) {
      throw new NotFoundException(`ServiceOfRecord with id ${id} not found`);
    }

    return serviceOfRecord;
  }

  async update(
    id: number,
    updateDto: UpdateServiceOfRecordDto,
  ): Promise<ServiceOfRecord> {
    const existing = await this.findOne(id);

    if (!existing) {
      throw new NotFoundException(`ServiceOfRecord with id ${id} not found`);
    }

    // Update basic fields
    Object.assign(existing, updateDto);

    // If you want to update child appointments (serviceRecords)
    if (updateDto.serviceRecords && Array.isArray(updateDto.serviceRecords)) {
      // Replace all existing child records (if that's your business rule)
      existing.serviceRecords = updateDto.serviceRecords.map((recordDto) =>
        this.recordOfAppointmentRepository.create(recordDto),
      );
    }

    return this.serviceOfRecordRepository.save(existing);
  }

  async remove(service_id: number): Promise<void> {
    const queryRunner =
      this.serviceOfRecordRepository.manager.connection.createQueryRunner();

    await queryRunner.startTransaction();
    try {
      // Delete related records in record_of_appointment
      await queryRunner.manager.delete(RecordOfAppointment, { service_id });

      // Now delete the service_of_record
      const result = await queryRunner.manager.delete(ServiceOfRecord, {
        service_id,
      });

      if (result.affected === 0) {
        throw new NotFoundException(
          `ServiceOfRecord with service_id ${service_id} not found`,
        );
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async removeRecord(service_id: number, record_id: number): Promise<void> {
    const recordToDelete = await this.recordOfAppointmentRepository.findOne({
      where: {
        record_id: record_id,
        service_id: service_id, // Ensure the right service_id is being matched
      },
    });

    if (!recordToDelete) {
      throw new NotFoundException(
        `Record with ID ${record_id} for service ID ${service_id} not found`,
      );
    }

    await this.recordOfAppointmentRepository.remove(recordToDelete); // Delete record
  }
}
