import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction-status.dto';

const TRANSACTION_INCLUDE = {
  customer: {
    select: { id: true, name: true, email: true, role: true },
  },
  items: {
    include: {
      food: {
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
          seller: { select: { id: true, name: true } },
        },
      },
    },
  },
};

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Buyer membuat transaksi baru dari item yang dikirim.
   * Stok makanan dikurangi secara atomik menggunakan Prisma transaction.
   */
  async create(createTransactionDto: CreateTransactionDto, customerId: string) {
    const { items, notes } = createTransactionDto;

    // Ambil data food sekaligus, validasi ketersediaan stok
    const foodIds = items.map((i) => i.foodId);
    const foods = await this.prisma.food.findMany({
      where: { id: { in: foodIds } },
    });

    if (foods.length !== foodIds.length) {
      const foundIds = foods.map((f) => f.id);
      const missing = foodIds.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        `Food tidak ditemukan: ${missing.join(', ')}`,
      );
    }

    // Validasi stok
    for (const item of items) {
      const food = foods.find((f) => f.id === item.foodId)!;
      if (food.stock < item.quantity) {
        throw new BadRequestException(
          `Stok ${food.name} tidak cukup. Tersedia: ${food.stock}, diminta: ${item.quantity}`,
        );
      }
    }

    // Hitung total amount
    const totalAmount = items.reduce((sum, item) => {
      const food = foods.find((f) => f.id === item.foodId)!;
      return sum + food.price * item.quantity;
    }, 0);

    // Jalankan dalam satu database transaction
    const transaction = await this.prisma.$transaction(async (tx) => {
      // Kurangi stok setiap makanan
      for (const item of items) {
        await tx.food.update({
          where: { id: item.foodId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Buat transaksi beserta item-nya
      return tx.transaction.create({
        data: {
          customerId,
          totalAmount,
          notes,
          items: {
            create: items.map((item) => {
              const food = foods.find((f) => f.id === item.foodId)!;
              return {
                foodId: item.foodId,
                quantity: item.quantity,
                price: food.price,
                subtotal: food.price * item.quantity,
              };
            }),
          },
        },
        include: TRANSACTION_INCLUDE,
      });
    });

    return transaction;
  }

  /** Ambil semua transaksi milik buyer yang sedang login */
  async findAllByCustomer(customerId: string) {
    return this.prisma.transaction.findMany({
      where: { customerId },
      include: TRANSACTION_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Admin/seller: ambil semua transaksi */
  async findAll() {
    return this.prisma.transaction.findMany({
      include: TRANSACTION_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Ambil detail satu transaksi, validasi kepemilikan jika bukan admin/seller */
  async findOne(id: string, customerId?: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: TRANSACTION_INCLUDE,
    });

    if (!transaction) {
      throw new NotFoundException(`Transaksi dengan id ${id} tidak ditemukan`);
    }

    if (customerId && transaction.customerId !== customerId) {
      throw new NotFoundException(`Transaksi dengan id ${id} tidak ditemukan`);
    }

    return transaction;
  }

  /** Update status transaksi (seller/admin) */
  async updateStatus(id: string, dto: UpdateTransactionStatusDto) {
    await this.findOne(id);

    return this.prisma.transaction.update({
      where: { id },
      data: { status: dto.status as never },
      include: TRANSACTION_INCLUDE,
    });
  }

  /**
   * Buyer membatalkan transaksi sendiri.
   * Stok dikembalikan jika status masih pending.
   */
  async cancel(id: string, customerId: string) {
    const transaction = await this.findOne(id, customerId);

    if (transaction.status !== 'pending') {
      throw new BadRequestException(
        `Transaksi tidak bisa dibatalkan. Status saat ini: ${transaction.status}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Kembalikan stok
      for (const item of transaction.items) {
        await tx.food.update({
          where: { id: item.foodId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return tx.transaction.update({
        where: { id },
        data: { status: 'cancelled' as never },
        include: TRANSACTION_INCLUDE,
      });
    });
  }

  /**
   * Checkout dari cart: ambil semua item cart buyer, buat transaksi, lalu kosongkan cart.
   */
  async checkoutFromCart(notes: string | undefined, customerId: string) {
    const cartItems = await this.prisma.cart.findMany({
      where: { customerId },
      include: { food: true },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Keranjang belanja kosong');
    }

    // Validasi stok
    for (const item of cartItems) {
      if (item.food.stock < item.quantity) {
        throw new BadRequestException(
          `Stok ${item.food.name} tidak cukup. Tersedia: ${item.food.stock}, diminta: ${item.quantity}`,
        );
      }
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.food.price * item.quantity,
      0,
    );

    return this.prisma.$transaction(async (tx) => {
      // Kurangi stok
      for (const item of cartItems) {
        await tx.food.update({
          where: { id: item.foodId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Buat transaksi
      const transaction = await tx.transaction.create({
        data: {
          customerId,
          totalAmount,
          notes,
          items: {
            create: cartItems.map((item) => ({
              foodId: item.foodId,
              quantity: item.quantity,
              price: item.food.price,
              subtotal: item.food.price * item.quantity,
            })),
          },
        },
        include: TRANSACTION_INCLUDE,
      });

      // Kosongkan cart
      await tx.cart.deleteMany({ where: { customerId } });

      return transaction;
    });
  }
}
