import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/auth/dto/register.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'Budi Santoso' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'budi@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.BUYER,
    default: UserRole.BUYER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
