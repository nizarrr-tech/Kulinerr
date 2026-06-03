import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  UserPayload,
} from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiTags('Cart')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto, @CurrentUser('id') id: string) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  findAll(@CurrentUser('id') id: string) {
    return this.cartService.findAll(id);
  }

  @Get(':id')
  findOne(@CurrentUser('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  update(@Body() updateCartDto: UpdateCartDto, @CurrentUser('id') id: string) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(@CurrentUser('id') id: string) {
    return this.cartService.remove(id);
  }
}
