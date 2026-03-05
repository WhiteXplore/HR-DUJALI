import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvailableTrainingDto } from './dto/create-available-training.dto';
import { UpdateAvailableTrainingDto } from './dto/update-available-training.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvailableTraining } from './entities/available-training.entity';
import { TrainingPosition } from './entities/training_positions.entity';
import { EmploymentStatus } from './entities/employment_status.entity';
import { TrainingEducationalLevel } from './entities/training_educational_level.entity';

@Injectable()
export class AvailableTrainingsService {
  constructor(
    @InjectRepository(AvailableTraining)
    private readonly trainingRepository: Repository<AvailableTraining>,

    @InjectRepository(TrainingPosition)
    private readonly positionRepository: Repository<TrainingPosition>,

    @InjectRepository(EmploymentStatus)
    private readonly employmentStatusRepository: Repository<EmploymentStatus>,

    @InjectRepository(TrainingEducationalLevel)
    private readonly levelRepository: Repository<TrainingEducationalLevel>,
  ) {}

  // 🔹 Helper: format entity into clean payload
  private formatTraining(training: AvailableTraining) {
    return {
      training_id: training.training_id,
      title: training.title,
      title_description: training.title_description,
      category: training.category,
      date_from: training.date_from,
      date_to: training.date_to,
      type_of_ld: training.type_of_ld,
      training_hours: training.training_hours,
      experience_year_from: training.experience_year_from,
      experience_year_to: training.experience_year_to,
      training_positions:
        training.training_positions?.map((p) => ({ name: p.name })) || [],
      employment_statuses:
        training.employment_statuses?.map((e) => ({ name: e.name })) || [],
      training_educational_levels:
        training.training_educational_levels?.map((l) => ({ name: l.name })) ||
        [],
    };
  }

  async create(createAvailableTrainingDto: CreateAvailableTrainingDto) {
    const {
      training_position,
      employment_status,
      training_educational_level,
      ...rest
    } = createAvailableTrainingDto;

    const training = this.trainingRepository.create({
      ...rest,
      training_positions: training_position?.map((pos) =>
        this.positionRepository.create({ name: pos }),
      ),
      employment_statuses: employment_status?.map((status) =>
        this.employmentStatusRepository.create({ name: status }),
      ),
      training_educational_levels: training_educational_level?.map((level) =>
        this.levelRepository.create({ name: level }),
      ),
    });

    await this.trainingRepository.save(training);
    return this.findOne(training.training_id);
  }

  async findAll() {
    const trainings = await this.trainingRepository.find({
      relations: [
        'training_positions',
        'employment_statuses',
        'training_educational_levels',
      ],
    });
    return trainings.map((t) => this.formatTraining(t));
  }

  async findOne(id: number) {
    const training = await this.trainingRepository.findOne({
      where: { training_id: id },
      relations: [
        'training_positions',
        'employment_statuses',
        'training_educational_levels',
      ],
    });

    if (!training) {
      throw new NotFoundException(`Training with ID ${id} not found!`);
    }
    return this.formatTraining(training);
  }

  async update(
    id: number,
    updateAvailableTrainingDto: UpdateAvailableTrainingDto,
  ) {
    const {
      training_position,
      employment_status,
      training_educational_level,
      ...rest
    } = updateAvailableTrainingDto;

    const training = await this.trainingRepository.findOne({
      where: { training_id: id },
      relations: [
        'training_positions',
        'employment_statuses',
        'training_educational_levels',
      ],
    });

    if (!training) {
      throw new NotFoundException(`Training with ID ${id} not found!`);
    }

    Object.assign(training, rest);

    if (training_position) {
      training.training_positions = training_position.map((pos) =>
        this.positionRepository.create({ name: pos }),
      );
    }

    if (employment_status) {
      training.employment_statuses = employment_status.map((status) =>
        this.employmentStatusRepository.create({ name: status }),
      );
    }

    if (training_educational_level) {
      training.training_educational_levels = training_educational_level.map(
        (lvl) => this.levelRepository.create({ name: lvl }),
      );
    }

    await this.trainingRepository.save(training);
    return this.findOne(id);
  }

  async remove(id: number) {
    const training = await this.trainingRepository.findOne({
      where: { training_id: id },
    });

    if (!training) {
      throw new NotFoundException(`Training with ID ${id} not found!`);
    }
    await this.trainingRepository.remove(training);
    return { message: `Training with ID ${id} has been removed.` };
  }
}
