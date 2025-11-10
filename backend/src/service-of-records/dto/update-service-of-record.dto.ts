import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceOfRecordDto } from './create-service-of-record.dto';

export class UpdateServiceOfRecordDto extends PartialType(
  CreateServiceOfRecordDto,
) {}
