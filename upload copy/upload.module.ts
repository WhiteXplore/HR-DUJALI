import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirstTable } from './entities/firstTable.entity';
import { SecondTable } from './entities/secondTable.entity';
import { ThirdTable } from './entities/thirdTable.entity';
@Module({
  imports: [TypeOrmModule.forFeature([FirstTable, SecondTable, ThirdTable])],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
