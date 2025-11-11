import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  UseGuards,
  Param,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthRequest } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    return this.authService.login(email, password, res);
  }

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('first_name') first_name: string,
    @Body('last_name') last_name: string,
    @Body('role') role: string,
    @Res() res: Response,
  ) {
    if (!email || !password || !first_name || !last_name || !role) {
      throw new BadRequestException('All fields are required');
    }

    return this.authService.register(
      email,
      password,
      first_name,
      last_name,
      role,
      res,
    );
  }

  @Put('user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body('first_name') first_name: string,
    @Body('last_name') last_name: string,
    @Body('email') email: string,
    @Body('role') role: string,
    @Body('password') password?: string,
  ) {
    return this.authService.updateUser(
      +id,
      first_name,
      last_name,
      email,
      role,
      password,
    );
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: AuthRequest) {
    return req.user;
  }
}
