// ============================================================
//  modules/auth/dto/register.dto.ts
// ============================================================
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
}

export class RegisterDto {
  @ApiProperty({
    example: 'Budi Santoso',
    description: 'Nama lengkap pengguna',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'budi@email.com',
    description: 'Alamat email unik pengguna',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password minimal 6 karakter',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: UserRole.BUYER,
    description: 'Role pengguna: buyer atau seller',
    enum: UserRole,
    default: UserRole.BUYER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}


