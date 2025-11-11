import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User_Accounts } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User_Accounts])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
