import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BcryptModule } from 'src/bcrypt/bcrypt.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ??
          'rahasia_wong_lumajang_123',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') ?? '1h',
        },
      }),
    }),
    PrismaModule,
    BcryptModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
