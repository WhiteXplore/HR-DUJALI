import { Module } from '@nestjs/common';
import { ServiceOfRecordsService } from './service-of-records.service';
import { ServiceOfRecordsController } from './service-of-records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordOfAppointment } from './entities/record_of_appointment.entity';
import { ServiceOfRecord } from './entities/service-of-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecordOfAppointment, ServiceOfRecord])],
  controllers: [ServiceOfRecordsController],
  providers: [ServiceOfRecordsService],
})
export class ServiceOfRecordsModule {}
