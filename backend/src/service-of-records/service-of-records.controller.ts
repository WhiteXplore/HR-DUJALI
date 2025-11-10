import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ServiceOfRecordsService } from './service-of-records.service';
import { CreateServiceOfRecordDto } from './dto/create-service-of-record.dto';
import { UpdateServiceOfRecordDto } from './dto/update-service-of-record.dto';
import { ServiceOfRecord } from './entities/service-of-record.entity';

@Controller('service-of-records')
export class ServiceOfRecordsController {
  constructor(
    private readonly serviceOfRecordsService: ServiceOfRecordsService,
  ) {}

  @Post('add-service')
  async create(
    @Body() createServiceOfRecordDto: CreateServiceOfRecordDto,
  ): Promise<ServiceOfRecord> {
    return this.serviceOfRecordsService.create(createServiceOfRecordDto);
  }

  // Bulk import endpoint
  @Post('bulk-import')
  async bulkImport(
    @Body() employees: CreateServiceOfRecordDto[],
  ): Promise<ServiceOfRecord[]> {
    return this.serviceOfRecordsService.createMany(employees);
  }

  @Get('get-all')
  async findAll(): Promise<ServiceOfRecord[]> {
    return this.serviceOfRecordsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceOfRecord> {
    return this.serviceOfRecordsService.findOne(id);
  }

  /** Update a service of record by ID */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceOfRecordDto: UpdateServiceOfRecordDto,
  ): Promise<ServiceOfRecord> {
    return this.serviceOfRecordsService.update(id, updateServiceOfRecordDto);
  }

  @Delete('service/:service_id')
  async remove(
    @Param('service_id', ParseIntPipe) service_id: number,
  ): Promise<void> {
    await this.serviceOfRecordsService.remove(service_id);
  }

  @Delete(':service_id/record/:record_id')
  async removeRecord(
    @Param('service_id', ParseIntPipe) service_id: number,
    @Param('record_id', ParseIntPipe) record_id: number,
  ): Promise<void> {
    await this.serviceOfRecordsService.removeRecord(service_id, record_id);
  }
}
