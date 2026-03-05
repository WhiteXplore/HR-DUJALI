import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateLearningDto } from './dto/update-leadning.dto';
import { FifthTable } from './entities/fifthTable.entity';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // ===============================
  // CREATE / UPLOAD DATA
  // ===============================
  @Post('add-data')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUploadDto: CreateUploadDto) {
    return await this.uploadService.create(createUploadDto);
  }

  @Post('upload-data')
  @HttpCode(HttpStatus.CREATED)
  async uploadEmployee(@Body() createUploadDtos: CreateUploadDto[]) {
    return await this.uploadService.uploadEmployee(createUploadDtos);
  }

  // ===============================
  // GET DATA
  // ===============================
  @Get('get-all')
  async findAll() {
    return await this.uploadService.findAll();
  }

  @Get('employee-details')
  async getEmployeeDetails() {
    return await this.uploadService.getEmployeeDetailsFromView();
  }

  @Get('get-eligible-employees-trainings')
  async getEligibleEmployeesForTrainings() {
    return await this.uploadService.getEligibleEmployeesFromView();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.uploadService.findById(id);
  }

  // ===============================
  // UPDATE DATA
  // ===============================
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() updateUploadDto: CreateUploadDto,
  ) {
    return await this.uploadService.update(id, updateUploadDto);
  }

  /**
   * Update FifthTable (Learning Records) for a single employee
   */
  @Patch('update-fifth/:id')
  async updateFifth(
    @Param('id') id: number,
    @Body('learningRecords') learningRecords: Partial<FifthTable>[],
  ) {
    return this.uploadService.updateFifthTable(+id, learningRecords);
  }

  /**
   * Update Learning Records (bulk)
   */
  @Patch('update-learning')
  @HttpCode(HttpStatus.OK)
  async updateLearningRecords(@Body() payload: UpdateLearningDto[]) {
    const results: any[] = [];

    for (const record of payload) {
      const res = await this.uploadService.updateFifthTable(
        record.first_table_id,
        [
          {
            first_table_id: record.first_table_id,
            title_learning_development: record.title_learning_development,
            ld_from: record.ld_from,
            ld_to: record.ld_to,
            ld_number_of_hours: record.ld_number_of_hours,
            type_of_ld: record.type_of_ld,
            ld_conducted_sponsor: record.ld_conducted_sponsor,
          },
        ],
      );
      results.push(res);
    }

    return { message: 'Learning records updated', results };
  }

  // ===============================
  // DELETE DATA
  // ===============================
  @Delete('delete-record/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number) {
    return await this.uploadService.remove(id);
  }
}
