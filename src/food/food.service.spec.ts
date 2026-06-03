import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
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

describe('FoodService', () => {
  let service: FoodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<FoodService>(FoodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
