import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServiceOfRecordsModule } from './service-of-records/service-of-records.module';
import { UploadModule } from './upload/upload.module';
import { PredictiveModule } from './predictive/predictive.module';
import { HttpModule } from '@nestjs/axios';
import { AttendanceRecordModule } from './attendance-record/attendance-record.module';
import { AvailableTrainingsModule } from './available-trainings/available-trainings.module';
import { CustomerFeedbackModule } from './customer-feedback/customer-feedback.module';
import { PromotionCriteriaModule } from './promotion-criteria/promotion-criteria.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.2',
      port: 3306,
      username: 'root',
      password: 'admin12345..',
      database: 'hris',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    ServiceOfRecordsModule,
    UploadModule,
    PredictiveModule,
    AttendanceRecordModule,
    AvailableTrainingsModule,
    CustomerFeedbackModule,
    PromotionCriteriaModule,
  ],
})
export class AppModule {}
