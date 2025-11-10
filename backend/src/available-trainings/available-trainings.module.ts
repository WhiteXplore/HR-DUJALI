import { Module } from '@nestjs/common';
import { AvailableTrainingsService } from './available-trainings.service';
import { AvailableTrainingsController } from './available-trainings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailableTraining } from './entities/available-training.entity';
import { TrainingPosition } from './entities/training_positions.entity';
import { EmploymentStatus } from './entities/employment_status.entity';
import { TrainingEducationalLevel } from './entities/training_educational_level.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      AvailableTraining,
      TrainingPosition,
      EmploymentStatus,
      TrainingEducationalLevel,
    ]),
  ],
  controllers: [AvailableTrainingsController],
  providers: [AvailableTrainingsService],
})
export class AvailableTrainingsModule {}
