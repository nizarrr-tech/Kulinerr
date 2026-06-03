import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCartDto: CreateCartDto, customerId?: string) {
    const resolvedCustomerId = customerId ?? createCartDto.customerId;

    if (!resolvedCustomerId) {
      throw new NotFoundException(
        'Customer tidak ditemukan dari token atau request body',
      );
    }

    await this.ensureUserExists(resolvedCustomerId);
    await this.ensureFoodExists(createCartDto.foodId);

    return this.prisma.cart.upsert({
      where: {
        customerId_foodId: {
          customerId: resolvedCustomerId,
          foodId: createCartDto.foodId,
        },
      },
      update: {
        quantity: { increment: createCartDto.quantity ?? 1 },
      },
      create: {
        customerId: resolvedCustomerId,
        foodId: createCartDto.foodId,
        quantity: createCartDto.quantity ?? 1,
      },
      include: { customer: true, food: true },
    });
  }

  async findAll(customerId?: string) {
    return this.prisma.cart.findMany({
      where: customerId ? { customerId } : undefined,
      include: { customer: true, food: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, customerId?: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { id, ...(customerId ? { customerId } : {}) },
      include: { customer: true, food: true },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with id ${id} not found`);
    }

    return cart;
  }

  async update(id: string, updateCartDto: UpdateCartDto, customerId?: string) {
    await this.findOne(id, customerId);

    if (updateCartDto.foodId) {
      await this.ensureFoodExists(updateCartDto.foodId);
    }

    return this.prisma.cart.update({
      where: { id },
      data: {
        foodId: updateCartDto.foodId,
        quantity: updateCartDto.quantity,
      },
      include: { customer: true, food: true },
    });
  }

  async remove(id: string, customerId?: string) {
    await this.findOne(id, customerId);

    return this.prisma.cart.delete({
      where: { id },
    });
  }

  private async ensureUserExists(customerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${customerId} not found`);
    }
  }

  private async ensureFoodExists(foodId: string) {
    const food = await this.prisma.food.findUnique({ where: { id: foodId } });

    if (!food) {
      throw new NotFoundException(`Food with id ${foodId} not found`);
    }
  }
}
