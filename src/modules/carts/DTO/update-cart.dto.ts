import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCartDto {
  @ApiProperty({
    example: 5,
    description: 'Jumlah baru item. Set ke 0 untuk menghapus item dari keranjang.',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantity: number;
}