import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { PrismaService } from 'src/prisma/prisma.service';
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

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: BcryptService, useValue: bcryptMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
