import { Module } from '@nestjs/common';
import { AttendanceRecordService } from './attendance-record.service';
import { AttendanceRecordController } from './attendance-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceRecord } from './entities/attendance-record.entity';
import { AttendanceRecordData } from './entities/attendance-record-data.entity';
@Module({
  imports: [TypeOrmModule.forFeature([AttendanceRecord, AttendanceRecordData])],
  controllers: [AttendanceRecordController],
  providers: [AttendanceRecordService],
})
export class AttendanceRecordModule {}
