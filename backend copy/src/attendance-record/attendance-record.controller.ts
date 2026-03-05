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
import { AttendanceRecordService } from './attendance-record.service';
import { CreateAttendanceRecordDto } from './dto/create-attendance-record.dto';
import { UpdateAttendanceRecordDto } from './dto/update-attendance-record.dto';

@Controller('attendance-record')
export class AttendanceRecordController {
  constructor(
    private readonly attendanceRecordService: AttendanceRecordService,
  ) {}

  // Create single record with nested records
  @Post('get-attendance')
  create(@Body() createAttendanceRecordDto: CreateAttendanceRecordDto) {
    return this.attendanceRecordService.create(createAttendanceRecordDto);
  }

  // Bulk create multiple attendance records
  @Post('bulk')
  createMany(@Body() createAttendanceRecordDtos: CreateAttendanceRecordDto[]) {
    return this.attendanceRecordService.createMany(createAttendanceRecordDtos);
  }

  // Get all attendance records with nested records
  @Get('get-all')
  findAll() {
    return this.attendanceRecordService.findAll();
  }

  @Get('monthly-attendance-report')
  async getMonthlyAttendanceReport() {
    return await this.attendanceRecordService.getMonthlyAttendanceReport();
  }

  // Get a single attendance record by ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceRecordService.findOne(id);
  }

  // Update a parent attendance record and its nested records
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAttendanceRecordDto: UpdateAttendanceRecordDto,
  ) {
    return this.attendanceRecordService.update(id, updateAttendanceRecordDto);
  }

  // Delete a full attendance record by ID
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceRecordService.remove(id);
  }
}
