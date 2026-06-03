import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await this.bcryptService.hashPassword(
      createUserDto.password,
    );

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        role: createUserDto.role as never,
        password: hashedPassword,
      },
    });

    return this.excludePassword(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => this.excludePassword(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.excludePassword(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: { email: updateUserDto.email, NOT: { id } },
      });

      if (existingUser) {
        throw new ConflictException('Email sudah terdaftar');
      }
    }

    const data = { ...updateUserDto };

    if (data.password) {
      data.password = await this.bcryptService.hashPassword(data.password);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: data as never,
    });

    return this.excludePassword(user);
  }

  async remove(id: string) {
    await this.findOne(id);

    const user = await this.prisma.user.delete({
      where: { id },
    });

    return this.excludePassword(user);
  }

  private excludePassword<T extends { password: string }>(user: T) {
    const { password, ...result } = user;
    return result;
  }
}
