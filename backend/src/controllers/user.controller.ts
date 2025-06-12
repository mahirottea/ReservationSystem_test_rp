import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserService } from '@/services/user.service';

@Controller('users')
export class UserController {
  constructor(private prisma: PrismaService,private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return this.prisma.user.findMany({
      select: { id: true, name: true }, // フロント用に必要な情報だけ
    });
  }

   @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
