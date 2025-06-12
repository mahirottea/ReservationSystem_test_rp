import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ReservationModule } from './modules/reservation.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './controllers/user.controller';
import { StaffController } from './controllers/staff.controller';
import { ServiceController } from './controllers/service.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceService } from './services/service.service';
import { StaffModule } from './modules/staff.module';
import { UserModule } from './modules/user.module';
import { SettingModule } from './modules/setting.module';
import { ServiceModule } from './modules/service.module';
import { CouponModule } from './modules/coupon.module';
import { SetupModule } from './modules/setup.module';
import { CustomerModule } from './modules/customer.module';
import { AnalyticsModule } from './modules/analytics.module';
import { PaymentModule } from './modules/payment.module';
import { NotificationModule } from './modules/notification.module';
import { QuestionnaireModule } from './modules/questionnaire.module';
import { TimeSlotPriceModule } from './modules/timeslot-price.module';
import { SeatTypeModule } from './modules/seat-type.module';
import { EventModule } from './modules/event.module';
import { CarModule } from './modules/car.module';
import { SchoolModule } from './modules/school.module';

@Module({
  imports: [
    PrismaModule,
    SetupModule,
    ServiceModule,
    ReservationModule,
    AuthModule,
    PassportModule,
    SettingModule,
    UserModule,
    StaffModule,
    CouponModule,
    CustomerModule,
    AnalyticsModule,
    PaymentModule,
    NotificationModule,
    QuestionnaireModule,
    TimeSlotPriceModule,
    SeatTypeModule,
    EventModule,
    CarModule,
    SchoolModule,
    JwtModule.register({
      secret:  process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule.forRoot({
      isGlobal: true, // 全モジュールで使えるように
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AppController,
    // 既存コントローラに加えて以下を追加
    UserController,
    StaffController,
    ServiceController,
  ],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    JwtStrategy,
    PrismaService,
    ServiceService,
  ],
})

export class AppModule {}
