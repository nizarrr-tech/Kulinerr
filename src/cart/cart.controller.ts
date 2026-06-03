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
  create(
    @Body() createCartDto: CreateCartDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.cartService.create(createCartDto, user?.id);
  }

  @Get()
  findAll(@CurrentUser() user: UserPayload) {
    return this.cartService.findAll(user?.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.cartService.findOne(id, user?.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.cartService.update(id, updateCartDto, user?.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.cartService.remove(id, user?.id);
  }
}
