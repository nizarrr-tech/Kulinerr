import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const prismaMock = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const bcryptMock = {
  hashPassword: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: BcryptService, useValue: bcryptMock },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
