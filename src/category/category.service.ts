import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findFirst({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Kategori sudah ada');
    }

    return this.prisma.category.create({
      data: createCategoryDto,
      include: { foods: true },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: { foods: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { foods: true },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    if (updateCategoryDto.name) {
      const existingCategory = await this.prisma.category.findFirst({
        where: { name: updateCategoryDto.name, NOT: { id } },
      });

      if (existingCategory) {
        throw new ConflictException('Kategori sudah ada');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: { foods: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
