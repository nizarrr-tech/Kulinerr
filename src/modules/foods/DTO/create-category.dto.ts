import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Makanan Berat',
    description: 'Nama kategori',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Kategori untuk nasi, rawon, soto, dan makanan mengenyangkan lainnya',
    description: 'Deskripsi kategori (opsional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}