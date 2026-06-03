import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateFoodDto {
  @ApiProperty({ example: 'Rawon Daging', description: 'Nama menu makanan' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Rawon khas Jawa Timur dengan daging empuk' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 25000, minimum: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 20, minimum: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: 'https://example.com/rawon.jpg' })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'uuid-category' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    example: 'uuid-seller',
    description:
      'Opsional. Jika tidak dikirim dan user login, akan diisi dari token seller.',
  })
  @IsOptional()
  @IsString()
  sellerId?: string;
}
