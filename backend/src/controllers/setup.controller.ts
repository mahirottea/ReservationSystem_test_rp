import * as bcrypt from 'bcrypt';
import { Controller, Post, Body, Get, Put, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantService } from '../services/tenant.service';
import { UserService } from '../services/user.service';
import { SettingService } from '../services/setting.service';
import { StaffService } from '../services/staff.service';
import { ServiceService } from '../services/service.service';
import { CouponService } from '../services/coupon.service';
import { CreateSetupDto } from '@/dtos/create-setup.dto';

@Controller('setup')
export class SetupController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly userService: UserService,
    private readonly settingService: SettingService,
    private readonly staffService: StaffService,
    private readonly serviceService: ServiceService,
    private readonly couponService: CouponService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createSetup(@Body() body: any, @Req() req: any) {
    // 1. パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(body.admin.password, 10);

    // 2. Prisma transaction 用にデータ整形
    const tenantData = body.tenant;

    const staffList = body.staffList
      ? body.staffList.map((s) => ({
          ...s,
          // tenantId は後で追加（create後に取得できる ID を使用）
        }))
      : [];

    const serviceList = body.menuList
      ? body.menuList.map((m) => ({
          ...m,
          // tenantId は同様に後から挿入
        }))
      : [];

    const result = await this.prisma.$transaction(async (tx) => {
      // 3. テナント作成
      const createdTenant = await tx.tenant.create({
        data: {
          name: body.tenant.name,
          address: body.tenant.address,
          phone: body.tenant.phone,
          type: body.tenant.type,
          email: body.admin.email, // ✅ ← 必須項目を明示的に追加
        },
      });
      const tenantId = createdTenant.id;

      // 4. 管理者作成
      await tx.user.create({
        data: {
          name: body.admin.name,
          email: body.admin.email,
          password: hashedPassword,
          role: 'admin',
          tenantId,
        },
      });

      // 5. 設定作成
      await tx.setting.create({
        data: {
          ...body.setting,
          tenantId,
        },
      });

      // 6. スタッフ・メニュー作成
      await tx.staff.createMany({
        data: staffList.map((s) => ({ ...s, tenantId })),
      });

      await tx.service.createMany({
        data: serviceList.map((m) => ({
          name: m.name,
          duration: Number(m.time), // time を Int に変換
          price: Number(m.price),
          allowMultiple: m.allowMultiple,
          tenantId,
        })),
      });

      // 7. クーポン作成
      await tx.coupon.create({
        data: {
          ...body.coupon,
          tenantId,
        },
      });

      // business specific tables
      if (body.type === 'car') {
        await tx.carSetting.create({
          data: {
            tenantId,
            deposit: Number(body.deposit || 0),
            lateFee: body.lateFee || '',
            useInventory: body.useInventory ?? true,
          },
        });
        if (body.items?.length) {
          await tx.carItem.createMany({
            data: body.items.map((i) => ({
              name: i.name,
              type: i.type,
              stock: Number(i.stock || 0),
              tenantId,
            })),
          });
        }
      }

      if (body.type === 'event') {
        if (body.events?.length) {
          for (const ev of body.events) {
            const createdEvent = await tx.event.create({
              data: {
                tenantId,
                name: ev.name || ev.title,
                date: new Date(ev.date),
                location: ev.location,
                capacity: Number(ev.capacity || 0),
              },
            });
            if (ev.ticket) {
              await tx.ticketType.create({
                data: {
                  eventId: createdEvent.id,
                  type: ev.ticket.type,
                  price: Number(ev.ticket.price || 0),
                  quantity: ev.ticket.quantity ? Number(ev.ticket.quantity) : 0,
                },
              });
            }
          }
        }
        if (body.tickets?.length) {
          for (const ticket of body.tickets) {
            const ev = await tx.event.create({
              data: {
                tenantId,
                name: ticket.type,
                date: new Date(),
                capacity: Number(ticket.quantity || 0),
              },
            });
            await tx.ticketType.create({
              data: {
                eventId: ev.id,
                type: ticket.type,
                price: Number(ticket.price || 0),
                quantity: Number(ticket.quantity || 0),
              },
            });
          }
        }
      }

      if (body.type === 'school') {
        await tx.schoolSetting.create({
          data: {
            tenantId,
            billingType: body.billingType,
            allowMakeup: body.allowMakeup ?? false,
          },
        });
        if (body.lessons?.length) {
          await tx.schoolLesson.createMany({
            data: body.lessons.map((l) => ({
              name: l.name,
              day: l.day,
              time: l.time,
              tenantId,
            })),
          });
        }
        if (body.instructors?.length) {
          await tx.instructor.createMany({
            data: body.instructors.map((i) => ({
              name: i.name,
              subjects: i.subjects,
              tenantId,
            })),
          });
        }
      }

      return tenantId;
    });

    await this.prisma.tenant.update({
      where: { id: result },
      data: { setupCompleted: true },
    });

    await this.prisma.user.delete({
      where: { id: req.user.userId },
    });

    return {
      message: '初期設定が完了しました（トランザクション）',
      tenantId: result,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getSetup(@Query('tenantId') tenantId: string): Promise<any> {
    const tenant = await this.tenantService.findById(tenantId);
    const admin = await this.userService.findAdminByTenantId(tenantId);
    const setting = await this.settingService.findByTenantId(tenantId);
    const staffList = await this.staffService.findByTenantId(tenantId);
    const menuList = await this.serviceService.findByTenantId(tenantId);
    const coupon = await this.couponService.findByTenantId(tenantId);

    const carSetting = await this.prisma.carSetting.findUnique({
      where: { tenantId },
      include: { carItems: true },
    });

    const events = await this.prisma.event.findMany({
      where: { tenantId },
      include: { tickets: true },
    });

    const schoolSetting = await this.prisma.schoolSetting.findUnique({
      where: { tenantId },
      include: { lessons: true, instructors: true },
    });

    return {
      tenant,
      admin,
      setting,
      staffList,
      menuList,
      coupon,
      carSetting,
      events,
      schoolSetting,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateSetup(@Body() body: any) {
    const tenantId = body.tenantId;

    // hash password if needed
    let adminUpdateData = {
      name: body.admin.name,
      email: body.admin.email,
    };

    if (body.admin.password) {
      adminUpdateData['password'] = await bcrypt.hash(body.admin.password, 10);
    }

    const staffList = body.staffList
      ? body.staffList.map((s) => ({ ...s, tenantId }))
      : [];
    const serviceList = body.menuList
      ? body.menuList.map((m) => ({ ...m, tenantId }))
      : [];

    await this.prisma.$transaction([
      // 1. テナント情報の更新
      this.prisma.tenant.update({
        where: { id: tenantId },
        data: {
          name: body.tenant.name,
          email: body.tenant.email,
          address: body.tenant.address,
          phone: body.tenant.phone,
          type: body.tenant.type,
        },
      }),

      // 2. 管理者ユーザー更新（adminのみ）
      this.prisma.user.updateMany({
        where: { tenantId, role: 'admin' },
        data: adminUpdateData,
      }),

      // 3. 設定 upsert（存在すれば更新、なければ作成）
      this.prisma.setting.upsert({
        where: { tenantId },
        create: { ...body.setting, tenantId },
        update: body.setting,
      }),

      // 4. スタッフ更新（全削除 → 再登録）
      this.prisma.staff.deleteMany({ where: { tenantId } }),
      this.prisma.staff.createMany({ data: staffList }),

      // 5. メニュー更新（全削除 → 再登録）
      this.prisma.service.deleteMany({ where: { tenantId } }),
      this.prisma.service.createMany({ data: serviceList }),

      // 6. クーポン upsert（存在すれば更新）
      this.prisma.coupon.upsert({
        where: { tenantId },
        create: { ...body.coupon, tenantId },
        update: body.coupon,
      }),

      ...(body.type === 'car'
        ? [
            this.prisma.carSetting.upsert({
              where: { tenantId },
              create: {
                tenantId,
                deposit: Number(body.deposit || 0),
                lateFee: body.lateFee || '',
                useInventory: body.useInventory ?? true,
              },
              update: {
                deposit: Number(body.deposit || 0),
                lateFee: body.lateFee || '',
                useInventory: body.useInventory ?? true,
              },
            }),
            this.prisma.carItem.deleteMany({ where: { tenantId } }),
            ...(body.items?.length
              ? [
                  this.prisma.carItem.createMany({
                    data: body.items.map((i) => ({
                      name: i.name,
                      type: i.type,
                      stock: Number(i.stock || 0),
                      tenantId,
                    })),
                  }),
                ]
              : []),
          ]
        : []),

      ...(body.type === 'event'
        ? [
            this.prisma.event.deleteMany({ where: { tenantId } }),
            this.prisma.ticketType.deleteMany({
              where: { event: { tenantId } },
            }),
            ...(body.events?.length
              ? body.events.flatMap((ev) => [
                  this.prisma.event.create({
                    data: {
                      tenantId,
                      name: ev.name || ev.title,
                      date: new Date(ev.date),
                      location: ev.location,
                      capacity: Number(ev.capacity || 0),
                      tickets: ev.ticket
                        ? {
                            create: {
                              type: ev.ticket.type,
                              price: Number(ev.ticket.price || 0),
                              quantity: ev.ticket.quantity
                                ? Number(ev.ticket.quantity)
                                : 0,
                            },
                          }
                        : undefined,
                    },
                  }),
                ])
              : []),
          ]
        : []),

      ...(body.type === 'school'
        ? [
            this.prisma.schoolSetting.upsert({
              where: { tenantId },
              create: {
                tenantId,
                billingType: body.billingType,
                allowMakeup: body.allowMakeup ?? false,
              },
              update: {
                billingType: body.billingType,
                allowMakeup: body.allowMakeup ?? false,
              },
            }),
            this.prisma.schoolLesson.deleteMany({ where: { tenantId } }),
            this.prisma.instructor.deleteMany({ where: { tenantId } }),
            ...(body.lessons?.length
              ? [
                  this.prisma.schoolLesson.createMany({
                    data: body.lessons.map((l) => ({
                      name: l.name,
                      day: l.day,
                      time: l.time,
                      tenantId,
                    })),
                  }),
                ]
              : []),
            ...(body.instructors?.length
              ? [
                  this.prisma.instructor.createMany({
                    data: body.instructors.map((i) => ({
                      name: i.name,
                      subjects: i.subjects,
                      tenantId,
                    })),
                  }),
                ]
              : []),
          ]
        : []),
    ]);

    return {
      message: '初期設定を更新しました（トランザクション）',
    };
  }
}


