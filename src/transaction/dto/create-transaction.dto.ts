import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class TransactionItemDto {
  @ApiProperty({ example: 'uuid-food', description: 'ID makanan' })
  @IsNotEmpty()
  @IsString()
  foodId: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}

export class CreateTransactionDto {
  @ApiProperty({
    type: [TransactionItemDto],
    description: 'Daftar item transaksi',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  items: TransactionItemDto[];

  @ApiPropertyOptional({ example: 'Tanpa sambal', description: 'Catatan pesanan' })
  @IsOptional()
  @IsString()
  notes?: string;
}
