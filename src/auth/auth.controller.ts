// ============================================================
//  modules/auth/auth.controller.ts
// ============================================================
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// ── Response schema classes (untuk @ApiResponse({ type: ... })) ──────────
import { ApiProperty } from '@nestjs/swagger';

class RegisterResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Budi Santoso' })
  name: string;

  @ApiProperty({ example: 'budi@email.com' })
  email: string;

  @ApiProperty({ example: 'buyer' })
  role: string;

  @ApiProperty({ example: '2024-01-15T07:30:00.000Z' })
  createdAt: Date;
}

class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description:
      'JWT access token. Gunakan di header: Authorization: Bearer <token>',
  })
  access_token: string;

  @ApiProperty({
    example: {
      id: 1,
      name: 'Budi Santoso',
      email: 'budi@email.com',
      role: 'buyer',
    },
  })
  user: object;
}

class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({
    example: ['email must be an email', 'password should not be empty'],
  })
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
// ─────────────────────────────────────────────────────────────────────────

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ── POST /auth/register ──────────────────────────────────────────────
  @Post('register')
  @ApiOperation({
    summary: 'Daftar akun baru',
    description:
      'Membuat akun pengguna baru. Role default adalah **buyer**. ' +
      'Gunakan role **seller** jika ingin berjualan.',
  })
  @ApiBody({ type: RegisterDto }) // <-- INI yang bind skema ke Swagger UI
  @ApiCreatedResponse({
    description: 'Akun berhasil dibuat',
    type: RegisterResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Validasi gagal (field kosong / format email salah / password kurang dari 6 karakter)',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({ description: 'Email sudah terdaftar' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // ── POST /auth/login ─────────────────────────────────────────────────
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login dan dapatkan JWT token',
    description:
      'Login dengan email & password. ' +
      'Setelah login, salin **access_token** lalu klik tombol **Authorize 🔒** di atas halaman Swagger, ' +
      'dan paste token tersebut agar endpoint protected bisa diakses.',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Login berhasil, JWT token dikembalikan',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Email atau password salah' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
