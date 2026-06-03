import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @ApiProperty({
    example: 3,
    description: 'ID makanan yang ingin ditambahkan ke keranjang',
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  foodId: number;

  @ApiProperty({
    example: 2,
    description: 'Jumlah item yang ingin dipesan (minimal 1)',
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}