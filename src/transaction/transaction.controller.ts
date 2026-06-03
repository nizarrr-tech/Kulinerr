import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
} from 'src/auth/decorators/current-user.decorator';
import type { UserPayload } from 'src/auth/decorators/current-user.decorator';
import { Role } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction-status.dto';
import { TransactionService } from './transaction.service';

@ApiTags('Transaction')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // ── POST /transaction ─────────────────────────────────────────────────
  @Post()
  @Role('buyer')
  @ApiOperation({
    summary: 'Buat transaksi baru',
    description:
      'Buyer membuat transaksi baru dengan mengirimkan daftar item. ' +
      'Stok akan dikurangi secara otomatis.',
  })
  @ApiResponse({ status: 201, description: 'Transaksi berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Stok tidak cukup' })
  @ApiResponse({ status: 404, description: 'Food tidak ditemukan' })
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.transactionService.create(createTransactionDto, user.id);
  }

  // ── POST /transaction/checkout ────────────────────────────────────────
  @Post('checkout')
  @Role('buyer')
  @ApiOperation({
    summary: 'Checkout dari keranjang',
    description:
      'Membuat transaksi dari semua item di keranjang buyer, lalu mengosongkan keranjang.',
  })
  @ApiResponse({ status: 201, description: 'Checkout berhasil' })
  @ApiResponse({ status: 400, description: 'Keranjang kosong / stok tidak cukup' })
  checkout(
    @Body() checkoutDto: CheckoutDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.transactionService.checkoutFromCart(checkoutDto.notes, user.id);
  }

  // ── GET /transaction ──────────────────────────────────────────────────
  @Get()
  @ApiOperation({
    summary: 'Ambil transaksi',
    description:
      'Buyer mendapat transaksi miliknya sendiri. Seller mendapat semua transaksi.',
  })
  findMyTransactions(@CurrentUser() user: UserPayload) {
    if (user.role === 'seller') {
      return this.transactionService.findAll();
    }
    return this.transactionService.findAllByCustomer(user.id);
  }

  // ── GET /transaction/all ──────────────────────────────────────────────
  @Get('all')
  @Role('seller')
  @ApiOperation({
    summary: '[Seller] Ambil semua transaksi (explicit)',
    description: 'Hanya dapat diakses oleh seller. Mengembalikan semua transaksi.',
  })
  findAll() {
    return this.transactionService.findAll();
  }

  // ── GET /transaction/:id ──────────────────────────────────────────────
  @Get(':id')
  @ApiOperation({
    summary: 'Detail transaksi',
    description:
      'Buyer hanya bisa melihat transaksinya sendiri. Seller bisa melihat semua.',
  })
  @ApiParam({ name: 'id', description: 'ID transaksi' })
  findOne(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    const customerId = user.role === 'buyer' ? user.id : undefined;
    return this.transactionService.findOne(id, customerId);
  }

  // ── PATCH /transaction/:id/status ─────────────────────────────────────
  @Patch(':id/status')
  @Role('seller')
  @ApiOperation({
    summary: '[Seller] Update status transaksi',
    description:
      'Seller memperbarui status transaksi (paid, processing, completed, cancelled).',
  })
  @ApiParam({ name: 'id', description: 'ID transaksi' })
  @ApiResponse({ status: 200, description: 'Status berhasil diperbarui' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionStatusDto,
  ) {
    return this.transactionService.updateStatus(id, dto);
  }

  // ── PATCH /transaction/:id/cancel ─────────────────────────────────────
  @Patch(':id/cancel')
  @Role('buyer')
  @ApiOperation({
    summary: 'Batalkan transaksi',
    description:
      'Buyer membatalkan transaksi miliknya. Hanya bisa jika status masih pending. ' +
      'Stok akan dikembalikan.',
  })
  @ApiParam({ name: 'id', description: 'ID transaksi' })
  @ApiResponse({ status: 200, description: 'Transaksi berhasil dibatalkan' })
  @ApiResponse({
    status: 400,
    description: 'Tidak bisa dibatalkan (status bukan pending)',
  })
  cancel(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.transactionService.cancel(id, user.id);
  }
}
