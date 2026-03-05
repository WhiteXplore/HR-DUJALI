import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AvailableTrainingsService } from './available-trainings.service';
import { CreateAvailableTrainingDto } from './dto/create-available-training.dto';
import { UpdateAvailableTrainingDto } from './dto/update-available-training.dto';

@Controller('available-trainings')
export class AvailableTrainingsController {
  constructor(
    private readonly availableTrainingsService: AvailableTrainingsService,
  ) {}

  // CREATE (POST)
  @Post('add-training')
  create(@Body() createAvailableTrainingDto: CreateAvailableTrainingDto) {
    return this.availableTrainingsService.create(createAvailableTrainingDto);
  }

  // READ ALL
  @Get('get-training')
  findAll() {
    return this.availableTrainingsService.findAll();
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.availableTrainingsService.findOne(+id);
  }

  // UPDATE (PATCH)
  @Patch('update-training/:id')
  update(
    @Param('id') id: string,
    @Body() updateAvailableTrainingDto: UpdateAvailableTrainingDto,
  ) {
    return this.availableTrainingsService.update(
      +id,
      updateAvailableTrainingDto,
    );
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.availableTrainingsService.remove(+id);
  }
}
