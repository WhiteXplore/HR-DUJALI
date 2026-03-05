import { Controller, Get, Post } from '@nestjs/common';
import { PredictiveService } from './predictive.service';

@Controller('predictive')
export class PredictiveController {
  constructor(private readonly predictiveService: PredictiveService) {}

  @Get('fetch-and-predict')
  async fetchAndPredict() {
    return await this.predictiveService.fetchAndPredict();
  }

  @Get('fetch-promotion')
  async getPromotion() {
    return await this.predictiveService.getPromotionData();
  }

  // New POST endpoint to refresh the SQL view
  @Post('refresh-seminar-view')
  async refreshView() {
    await this.predictiveService.refreshSeminarView();
    return { message: 'Employee details view refreshed successfully' };
  }
}
