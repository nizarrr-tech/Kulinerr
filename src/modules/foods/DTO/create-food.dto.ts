import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsPositive, IsOptional, IsUrl, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFoodDto {
  @ApiProperty({
    example: 'Rawon Setan Pak Budi',
    description: 'Nama makanan / menu',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Rawon hitam pekat dengan daging sapi empuk, bumbu rempah khas Malang',
    description: 'Deskripsi detail makanan',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 25000,
    description: 'Harga dalam rupiah (IDR)',
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    example: 50,
    description: 'Stok yang tersedia',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @ApiPropertyOptional({
    example: 'https://example.com/images/rawon.jpg',
    description: 'URL foto makanan (opsional)',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({
    example: 1,
    description: 'ID kategori makanan (lihat endpoint GET /foods/categories)',
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  categoryId: number;
}