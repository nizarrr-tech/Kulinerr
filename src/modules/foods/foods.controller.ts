import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiProperty,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

// ── SWAGGER RESPONSE SCHEMAS ──
export class CategorySchema {
  @ApiProperty({ example: 1 }) id: number;
  @ApiProperty({ example: 'Makanan Berat' }) name: string;
  @ApiProperty({ example: 'Kategori untuk nasi, rawon, soto...' }) description: string;
}

export class FoodSchema {
  @ApiProperty({ example: 'd3b07384-d113-4403-a5bc-d13d12345678', description: 'UUID Makanan' }) id: string;
  @ApiProperty({ example: 'Rawon Setan Pak Budi' }) name: string;
  @ApiProperty({ example: 'Rawon hitam pekat dengan daging sapi empuk...' }) description: string;
  @ApiProperty({ example: 25000 }) price: number;
  @ApiProperty({ example: 50 }) stock: number;
  @ApiProperty({ example: 'https://example.com/images/rawon.jpg', nullable: true }) imageUrl: string;
  @ApiProperty({ type: () => CategorySchema }) category: CategorySchema;
  @ApiProperty({ example: '2026-06-02T04:30:00.000Z' }) createdAt: Date;
}

@ApiTags('Foods')
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get()
  @ApiOperation({
    summary: 'Ambil semua makanan',
    description: 'Mendukung filter berdasarkan nama dan kategori, serta pagination.',
  })
  @ApiQuery({ name: 'search', required: false, example: 'rawon', description: 'Cari berdasarkan nama makanan' })
  @ApiQuery({ name: 'categoryId', required: false, example: 1, description: 'Filter berdasarkan ID kategori' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Halaman (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Jumlah data per halaman (default: 10)' })
  @ApiOkResponse({ description: 'Daftar makanan berhasil diambil', type: [FoodSchema] })
  findAll(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.foodsService.findAll({ search, categoryId, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail satu makanan berdasarkan ID (UUID)' })
  @ApiParam({ name: 'id', example: 'd3b07384-d113-4403-a5bc-d13d12345678', description: 'ID makanan dalam bentuk UUID string' })
  @ApiOkResponse({ description: 'Makanan ditemukan', type: FoodSchema })
  @ApiNotFoundResponse({ description: 'Makanan tidak ditemukan' })
  findOne(@Param('id') id: string) {
    return this.foodsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Tambah makanan baru (Seller only)',
    description: '🔒 Membutuhkan JWT token. Hanya seller yang dapat menambahkan makanan.',
  })
  @ApiBody({ type: CreateFoodDto })
  @ApiCreatedResponse({ description: 'Makanan berhasil ditambahkan', type: FoodSchema })
  @ApiBadRequestResponse({ description: 'Validasi gagal' })
  @ApiUnauthorizedResponse({ description: 'Token tidak valid atau tidak ada' })
  @ApiForbiddenResponse({ description: 'Hanya seller yang diizinkan' })
  create(@Body() createFoodDto: CreateFoodDto, @Request() req: any) {
    return this.foodsService.create(createFoodDto, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update data makanan (Seller only)',
    description: '🔒 Membutuhkan JWT token. Semua field bersifat opsional — kirim hanya field yang ingin diubah.',
  })
  @ApiParam({ name: 'id', example: 'd3b07384-d113-4403-a5bc-d13d12345678', description: 'ID makanan (UUID)' })
  @ApiBody({ type: UpdateFoodDto })
  @ApiOkResponse({ description: 'Makanan berhasil diupdate', type: FoodSchema })
  @ApiNotFoundResponse({ description: 'Makanan tidak ditemukan' })
  @ApiUnauthorizedResponse({ description: 'Token tidak valid atau tidak ada' })
  update(
    @Param('id') id: string,
    @Body() updateFoodDto: UpdateFoodDto,
    @Request() req: any,
  ) {
    return this.foodsService.update(id, updateFoodDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Hapus makanan (Seller only)', description: '🔒 Membutuhkan JWT token.' })
  @ApiParam({ name: 'id', example: 'd3b07384-d113-4403-a5bc-d13d12345678', description: 'ID makanan yang akan dihapus (UUID)' })
  @ApiOkResponse({ description: 'Makanan berhasil dihapus' })
  @ApiNotFoundResponse({ description: 'Makanan tidak ditemukan' })
  @ApiUnauthorizedResponse({ description: 'Token tidak valid atau tidak ada' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.foodsService.remove(id, req.user);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Ambil semua kategori makanan' })
  @ApiOkResponse({ description: 'Daftar kategori', type: [CategorySchema] })
  findAllCategories() {
    return this.foodsService.findAllCategories();
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Tambah kategori baru (Seller only)', description: '🔒 Membutuhkan JWT token.' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiCreatedResponse({ description: 'Kategori berhasil dibuat', type: CategorySchema })
  @ApiBadRequestResponse({ description: 'Validasi gagal' })
  @ApiUnauthorizedResponse({ description: 'Token tidak valid atau tidak ada' })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.foodsService.createCategory(createCategoryDto);
  }
}