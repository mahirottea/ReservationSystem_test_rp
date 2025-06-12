import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from "crypto";
import * as jwt from "jsonwebtoken";
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { RememberLoginDto } from "../dtos/remember-login.dto";
import { DeleteTokenDto } from "../dtos/delete-token.dto";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService,
    private userService: UserService,
    private prisma: PrismaService, ) {}

  async validateUser(email: string, password: string): Promise<any> {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[AUTH] validateUser 呼び出し:', email);
    }
    const user = await this.userService.findByEmail(email);
    if (process.env.NODE_ENV !== 'production') {
      console.log('[AUTH] DBユーザー:', user);
    }
    if (!user || !user.password) {
      console.warn('[AUTH] ユーザーまたはパスワードなし');
      throw new UnauthorizedException('ユーザーが見つからないか、パスワード未設定です');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (process.env.NODE_ENV !== 'production') {
      console.log('[AUTH] パスワード照合結果:', isPasswordValid);
    }
    if (!isPasswordValid) {
      throw new UnauthorizedException('パスワードが一致しません');
    }

    return user;
  }

  async loginFromValidatedUser(user: any): Promise<{ accessToken: string, rememberToken: string }> {
    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
      subRole: user.subRole,
    };

    const accessToken = this.jwtService.sign(payload);

    // ✅ rememberToken を生成して DB に保存
    const rememberToken = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7日間有効

    await this.prisma.rememberToken.create({
      data: {
        token: rememberToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      rememberToken,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const { email, password, role, subRole, name, tenantId } = createUserDto;

    // 既存ユーザーのチェック
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('このメールアドレスは既に登録されています。');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        subRole,
        name,
        tenantId,
      },
    });
  }

  async loginAndIssueToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      subRole: user.subRole,
    };

    const accessToken = this.jwtService.sign(payload);

    // ✅ remember_token を生成して保存
    const rememberToken = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7日間

    await this.prisma.rememberToken.create({
      data: {
        token: rememberToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      rememberToken, // ✅ 返却する
    };
  }

  async rememberLogin(dto: RememberLoginDto) {
    const record = await this.prisma.rememberToken.findUnique({
      where: { token: dto.token },
      include: { user: true },
    });

    if (!record || new Date() > record.expiresAt) {
      throw new UnauthorizedException("無効または期限切れのトークンです");
    }

    const payload = {
      sub: record.user.id,
      email: record.user.email,
      role: record.user.role,
      subRole: record.user.subRole,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not set");

    const accessToken = jwt.sign(payload, secret, { expiresIn: "1h" });

    return { accessToken };
  }

  async deleteRememberToken(dto: DeleteTokenDto) {
    const { token } = dto;
    await this.prisma.rememberToken.deleteMany({
      where: { token },
    });
    return { message: "ログアウト処理が完了しました" };
  }

}