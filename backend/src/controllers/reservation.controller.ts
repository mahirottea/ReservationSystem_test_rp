import { Controller, Get, Post, Body, Delete, Req, Query, Param, Put, UseGuards, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ReservationService } from '@/services/reservation.service';
import { UpdateReservationDto } from '@/dtos/update-reservation.dto';
import { CreateReservationDto } from '@/dtos/create-reservation.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService , private prisma: PrismaService ) {}

  @Post()

  async createReservation(@Body() dto: CreateReservationDto, @Req() req: any) {
    const user = req.user;
    return this.reservationService.createReservation(dto, user.tenantId);
  }

  @Get('calendar')

  async getCalendarReservations(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('tenantId') tenantId: string,
    @Req() req: Request,
    @Query('staffId') staffId?: string,
  ) {
    const user = req.user as any;
    if (user.tenantId !== tenantId) {
      throw new ForbiddenException();
    }
    return this.reservationService.getCalendarReservations({
      from,
      to,
      tenantId,
      staffId,
   });
  }

  @Delete(':id')

  async deleteReservation(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    return this.reservationService.deleteReservation(id, user.tenantId);
  }

  @Put(':id')

  async updateReservation(
    @Param('id') id: string,
    @Body() updateDto: UpdateReservationDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.reservationService.update(id, updateDto, user.tenantId);
  }
  

}
