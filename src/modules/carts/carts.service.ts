import { Injectable } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartsService {
  getCart(userId: number) {
    return { items: [], totalItems: 0, totalPrice: 0 };
  }

  addToCart(dto: AddToCartDto, userId: number) {
    return { message: 'Item berhasil ditambahkan' };
  }

  updateQuantity(id: number, dto: UpdateCartDto, userId: number) {
    return { message: 'Quantity berhasil diubah' };
  }

  removeFromCart(id: number, userId: number) {
    return { message: 'Item berhasil dihapus' };
  }

  clearCart(userId: number) {
    return { message: 'Keranjang dikosongkan' };
  }
}