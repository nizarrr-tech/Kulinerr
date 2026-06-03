import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CheckoutDto {
  @ApiPropertyOptional({
    example: 'Tambah es teh ya',
    description: 'Catatan pesanan (opsional)',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
