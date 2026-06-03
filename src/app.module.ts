import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import databaseConfig from './config/database.config';

// Import Modul Fitur
import { AuthModule } from './modules/auth/auth.module';
import { FoodsModule } from './modules/foods/foods.module';
import { CartsModule } from './modules/carts/carts.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // 1. Mengaktifkan ConfigModule agar NestJS bisa membaca file .env (jika ada)
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    // 2. Konfigurasi Koneksi Database TypeORM (MySQL)
    TypeOrmModule.forRoot({
      type: 'mysql',
      // Jika di Railway, ia membaca process.env.DB_HOST, jika di XAMPP lokal otomatis ke 'localhost'
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'marketplace_kuliner_malang',
      
      // Mengotomatiskan pencarian file *.entity.ts yang terdaftar di forFeature() tiap modul
      autoLoadEntities: true,
      
      // Sinkronisasi struktur tabel otomatis ke database (Sangat cocok untuk masa development)
      synchronize: true, 
      
      // Opsional: aktifkan logging query database di terminal jika diperlukan
      logging: false, 
    }),

    // 3. Registrasi Seluruh Modul Fitur Aplikasi
    AuthModule,
    FoodsModule,
    PrismaModule,
    CartsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}