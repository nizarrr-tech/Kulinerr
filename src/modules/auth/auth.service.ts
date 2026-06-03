import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // 1. Fungsi Register (Daftar Akun Kuliner Baru)
  async register(body: any) {
    const { username, password } = body;

    // Cek apakah username sudah dipakai orang lain
    const existingUser = await this.userRepo.findOne({ where: { username } });
    if (existingUser) {
      throw new BadRequestException('Username wis digawe wong liya, Dikk!');
    }

    // Buat dan simpan user baru
    const user = this.userRepo.create({ username, password });
    const savedUser = await this.userRepo.save(user);

    // Hapus password dari respon biar aman
    delete savedUser.password;
    return savedUser;
  }

  // 2. Fungsi Login (Masuk Akun)
  async login(body: any) {
    const { username, password } = body;

    // Cari user berdasarkan username
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user || user.password !== password) {
      throw new BadRequestException('Username utawa password salah!');
    }

    // Buat bungkusan Token Satpam (JWT)
    const payload = { sub: user.id, username: user.username, role: user.role };

    return {
      message: 'Login sukses, selamat belanja di Kuliner Malang!',
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}