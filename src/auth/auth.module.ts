import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { StringValue } from 'ms';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN as StringValue },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, BcryptService],
})
export class AuthModule {}
