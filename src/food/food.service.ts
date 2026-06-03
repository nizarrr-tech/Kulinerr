import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFoodDto: CreateFoodDto, sellerId?: string) {
    if (createFoodDto.categoryId) {
      await this.ensureCategoryExists(createFoodDto.categoryId);
    }

    const data = {
      ...createFoodDto,
      sellerId: createFoodDto.sellerId ?? sellerId,
      stock: createFoodDto.stock ?? 0,
    };

    return this.prisma.food.create({
      data,
      include: { category: true, seller: true },
    });
  }

  async findAll() {
    return this.prisma.food.findMany({
      include: { category: true, seller: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const food = await this.prisma.food.findUnique({
      where: { id },
      include: { category: true, seller: true },
    });

    if (!food) {
      throw new NotFoundException(`Food with id ${id} not found`);
    }

    return food;
  }

  async update(id: string, updateFoodDto: UpdateFoodDto) {
    await this.findOne(id);

    if (updateFoodDto.categoryId) {
      await this.ensureCategoryExists(updateFoodDto.categoryId);
    }

    return this.prisma.food.update({
      where: { id },
      data: updateFoodDto,
      include: { category: true, seller: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.food.delete({
      where: { id },
    });
  }

  private async ensureCategoryExists(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }
  }
}
