import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ReservationController } from '@/controllers/reservation.controller';
import { ReservationService } from '@/services/reservation.service';
import { PaymentService } from '@/services/payment.service';
import { NotificationService } from '@/services/notification.service';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../modules/auth.module';

@Module({
  imports: [
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ReservationController],
  providers: [ReservationService, PaymentService, NotificationService],
})
export class ReservationModule {}