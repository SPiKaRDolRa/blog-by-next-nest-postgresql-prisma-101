import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  // ตรวจสอบผู้ใช้และคืน JWT เมื่อสำเร็จ
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    const payload = { sub: user.id, role: user.role, email: user.email };
    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }
}


