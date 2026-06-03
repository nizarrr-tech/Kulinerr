import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Aktifkan CORS agar API bisa diakses oleh aplikasi Frontend (React/Next.js/Vue)
  app.enableCors({
    origin: process.env.FRONTEND_URL, // Izinkan origin dari frontend
    credentials: true, // Izinkan pengiriman credentials (cookie, authorization header)
  });

  // 2. Set global prefix untuk semua endpoint (Misal: http://localhost:3000/api/foods)
  app.setGlobalPrefix('api');

  // 3. Aktifkan Global Validation Pipe untuk class-validator di DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Membuang properti yang tidak ada di DTO
      forbidNonWhitelisted: true, // Berikan error jika mengirim properti ilegal
      transform: true,            // Otomatis mengubah tipe data query/param sesuai tipe DTO
    }),
  );

  // 4. Konfigurasi Swagger UI Dokumentasi API
  const config = new DocumentBuilder()
    .setTitle('Marketplace Kuliner Malang API')
    .setDescription(
      'Dokumentasi API lengkap untuk Marketplace Kuliner Malang. ' +
      'Gunakan token JWT pada tombol Authorize untuk mengakses endpoint yang terkunci (🔒).',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Masukkan token JWT akses Anda di sini',
        in: 'header',
      },
      'access-token', // Nama security key ini HARUS SAMA dengan @ApiBearerAuth('access-token') di controller
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Swagger akan dapat diakses di: /api (atau ganti 'api' jika ingin /docs)
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Token JWT tidak akan hilang meski halaman Swagger di-refresh
    },
  });

  // 5. Taktik Dynamic Port untuk Railway Cloud / Mode Lokal
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();