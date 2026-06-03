import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { FoodModule } from './food/food.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    BcryptModule,
    CategoryModule,
    CartModule,
    FoodModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
