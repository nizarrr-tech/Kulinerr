import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum TransactionStatusEnum {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class UpdateTransactionStatusDto {
  @ApiProperty({
    enum: TransactionStatusEnum,
    example: TransactionStatusEnum.PAID,
    description: 'Status transaksi yang baru',
  })
  @IsNotEmpty()
  @IsEnum(TransactionStatusEnum, {
    message: `Status harus salah satu dari: ${Object.values(TransactionStatusEnum).join(', ')}`,
  })
  status: TransactionStatusEnum;
}
