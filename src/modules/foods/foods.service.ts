import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Food } from './entities/food.entity';
import { Category } from './entities/category.entity';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(query: { search?: string; categoryId?: number; page?: number; limit?: number }) {
    const { search, categoryId, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const whereCondition: any = {};

    if (search) {
      whereCondition.name = Like(`%${search}%`);
    }

    if (categoryId) {
      whereCondition.categoryId = categoryId;
    }

    const [data, total] = await this.foodRepository.findAndCount({
      where: whereCondition,
      relations: {
  category: true,
},
      take: limit,
      skip: skip,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const food = await this.foodRepository.findOne({
      where: { id },
    
relations: {
  category: true,
},
    });
    if (!food) {
      throw new NotFoundException(`Makanan dengan ID ${id} tidak ditemukan`);
    }
    return food;
  }

  async create(createFoodDto: CreateFoodDto, user: any) {
    const food = this.foodRepository.create(createFoodDto);
    return await this.foodRepository.save(food);
  }

  async update(id: string, updateFoodDto: UpdateFoodDto, user: any) {
    const food = await this.findOne(id);
    Object.assign(food, updateFoodDto);
    return await this.foodRepository.save(food);
  }

  async remove(id: string, user: any) {
    const food = await this.findOne(id);
    await this.foodRepository.remove(food);
    return { message: `Makanan dengan ID ${id} berhasil dihapus` };
  }

  async findAllCategories() {
    return await this.categoryRepository.find();
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }
}