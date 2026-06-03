import { Module } from '@nestjs/common';
import { BcryptModule } from 'src/bcrypt/bcrypt.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [BcryptModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
