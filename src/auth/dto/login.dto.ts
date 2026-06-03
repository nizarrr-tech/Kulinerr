// ============================================================
//  modules/auth/dto/login.dto.ts
// ============================================================
import { ApiProperty as ApiProp2 } from '@nestjs/swagger';
import {
  IsEmail as IsEmail2,
  IsNotEmpty as IsNotEmpty2,
  IsString as IsString2,
} from 'class-validator';

export class LoginDto {
  @ApiProp2({
    example: 'budi@email.com',
    description: 'Email yang terdaftar',
  })
  @IsEmail2()
  @IsNotEmpty2()
  email: string;

  @ApiProp2({
    example: 'password123',
    description: 'Password akun',
  })
  @IsNotEmpty2()
  @IsString2()
  password: string;
}
