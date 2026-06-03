import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    example: 'uuid-food',
    description: 'ID makanan yang dimasukkan ke keranjang',
  })
  @IsNotEmpty()
  @IsString()
  foodId: string;

  @ApiPropertyOptional({ example: 2, minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({
    example: 'uuid-user',
    description:
      'Opsional untuk admin/testing. Jika user login, customerId diambil dari token.',
  })
  @IsOptional()
  @IsString()
  customerId?: string;
}
