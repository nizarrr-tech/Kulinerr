import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    // 1. Daftarkan User Entity
    TypeOrmModule.forFeature([User]),

    // 2. Konfigurasi Passport & JWT
    PassportModule.register({ defaultStrategy: 'jwt' }), // Tambahkan default strategy
    JwtModule.register({
      secret: 'rahasia_wong_lumajang_123', 
      signOptions: { expiresIn: '1d' },    
    }),
  ],
  // 3. DAFTARKAN JwtStrategy DI SINI! (Ini yang tadi kurang)
  providers: [AuthService, JwtStrategy], 
  
  controllers: [AuthController],
  
  // 4. Export AuthService & JwtStrategy agar modul lain bisa mengenali satpam ini
  exports: [AuthService, PassportModule], 
})
export class AuthModule {}