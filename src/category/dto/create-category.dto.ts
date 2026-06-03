import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Makanan Berat',
    description: 'Nama kategori makanan',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Aneka nasi, lauk, dan makanan berat lainnya',
    description: 'Deskripsi kategori',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
