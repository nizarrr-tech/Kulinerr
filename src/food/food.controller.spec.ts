import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';

const prismaMock = {
  food: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  category: {
    findUnique: jest.fn(),
  },
};

describe('FoodController', () => {
  let controller: FoodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodController],
      providers: [
        FoodService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    controller = module.get<FoodController>(FoodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
