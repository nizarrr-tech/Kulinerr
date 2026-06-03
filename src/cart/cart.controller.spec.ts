import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

const prismaMock = {
  cart: {
    upsert: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: { findUnique: jest.fn() },
  food: { findUnique: jest.fn() },
};

describe('CartController', () => {
  let controller: CartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        CartService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
