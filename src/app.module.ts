import { Module } from '@nestjs/common';
import { FoodsModule } from './modules/foods/foods.module';
import { CartsModule } from './modules/carts/carts.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';
import { FoodModule } from './food/food.module';

@Module({
  imports: [AuthModule, FoodsModule, PrismaModule, CartsModule, UsersModule, BcryptModule, CategoryModule, CartModule, FoodModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
