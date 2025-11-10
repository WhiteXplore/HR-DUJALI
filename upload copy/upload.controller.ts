import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload-data')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUploadDto: CreateUploadDto) {
    const result = await this.uploadService.create(createUploadDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Upload created successfully',
      data: result,
    };
  }

  @Post('save-json-data')
  @HttpCode(HttpStatus.CREATED)
  async saveJsonData(@Body() jsonData: any) {
    const result = await this.uploadService.saveJsonData(jsonData);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Data saved successfully',
      data: result,
    };
  }
}
