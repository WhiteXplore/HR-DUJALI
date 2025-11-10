import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirstTable } from './entities/firstTable.entity';
import { SecondTable } from './entities/secondTable.entity';
import { ThirdTable } from './entities/thirdTable.entity';
import { FourthTable } from './entities/fourthTable.entity';
import { FifthTable } from './entities/fifthTable.entity';
import { SixthTable } from './entities/sixthTable.entity';
import { SeventhTable } from './entities/seventhTable.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      FirstTable,
      SecondTable,
      ThirdTable,
      FourthTable,
      FifthTable,
      SixthTable,
      SeventhTable,
    ]),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
