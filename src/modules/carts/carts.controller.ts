import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiProperty,
} from '@nestjs/swagger';

// Sesuaikan path import ini dengan project aslimu
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartsService } from './carts.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

// ── Swagger Response Schemas ──
export class CartFoodSchema {
  @ApiProperty({ example: 3 }) id: number;
  @ApiProperty({ example: 'Rawon Setan Pak Budi' }) name: string;
  @ApiProperty({ example: 25000 }) price: number;
  @ApiProperty({ example: 'https://example.com/images/rawon.jpg', nullable: true }) imageUrl: string;
}

export class CartItemSchema {
  @ApiProperty({ example: 1 }) id: number;
  @ApiProperty({ type: () => CartFoodSchema }) food: CartFoodSchema;
  @ApiProperty({ example: 2 }) quantity: number;
  @ApiProperty({ example: 50000, description: 'Subtotal = price × quantity' }) subtotal: number;
}

export class CartSummarySchema {
  @ApiProperty({ type: [CartItemSchema] }) items: CartItemSchema[];
  @ApiProperty({ example: 3, description: 'Total jumlah item berbeda' }) totalItems: number;
  @ApiProperty({ example: 75000, description: 'Total harga semua item' }) totalPrice: number;
}

@ApiTags('Carts')
@Controller('carts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Token tidak valid atau tidak disertakan' })
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lihat isi keranjang belanja',
    description: '🔒 Menampilkan semua item dalam keranjang milik user yang sedang login.',
  })
  @ApiOkResponse({
    description: 'Isi keranjang berhasil diambil',
    type: CartSummarySchema,
  })
  getCart(@Request() req: any) {
    return this.cartsService.getCart(req.user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Tambah item ke keranjang',
    description: '🔒 Menambahkan makanan ke keranjang. Jika makanan sudah ada di keranjang, quantity akan ditambahkan.',
  })
  @ApiBody({ type: AddToCartDto })
  @ApiCreatedResponse({ description: 'Item berhasil ditambahkan ke keranjang', type: CartItemSchema })
  @ApiBadRequestResponse({ description: 'Validasi gagal / stok tidak cukup' })
  @ApiNotFoundResponse({ description: 'Makanan tidak ditemukan' })
  addToCart(@Body() addToCartDto: AddToCartDto, @Request() req: any) {
    return this.cartsService.addToCart(addToCartDto, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update quantity item di keranjang',
    description: '🔒 Mengubah jumlah item tertentu di keranjang.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID cart item (bukan ID makanan)' })
  @ApiBody({ type: UpdateCartDto })
  @ApiOkResponse({ description: 'Quantity berhasil diupdate', type: CartItemSchema })
  @ApiNotFoundResponse({ description: 'Cart item tidak ditemukan' })
  @ApiBadRequestResponse({ description: 'Quantity tidak valid / stok tidak cukup' })
  updateQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartDto: UpdateCartDto,
    @Request() req: any,
  ) {
    return this.cartsService.updateQuantity(id, updateCartDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Hapus item dari keranjang',
    description: '🔒 Menghapus satu item dari keranjang berdasarkan cart item ID.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID cart item yang akan dihapus' })
  @ApiOkResponse({ description: 'Item berhasil dihapus dari keranjang' })
  @ApiNotFoundResponse({ description: 'Cart item tidak ditemukan' })
  removeFromCart(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.cartsService.removeFromCart(id, req.user.id);
  }

  @Delete()
  @ApiOperation({
    summary: 'Kosongkan seluruh keranjang',
    description: '🔒 Menghapus semua item dari keranjang milik user yang sedang login.',
  })
  @ApiOkResponse({ description: 'Keranjang berhasil dikosongkan' })
  clearCart(@Request() req: any) {
    return this.cartsService.clearCart(req.user.id);
  }
}