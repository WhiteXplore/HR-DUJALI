import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomerFeedbackService } from './customer-feedback.service';
import { CreateCustomerFeedbackDto } from './dto/create-customer-feedback.dto';
import { UpdateCustomerFeedbackDto } from './dto/update-customer-feedback.dto';

@Controller('customer-feedback')
export class CustomerFeedbackController {
  constructor(private readonly service: CustomerFeedbackService) {}

  @Post()
  create(@Body() dto: CreateCustomerFeedbackDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerFeedbackDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
