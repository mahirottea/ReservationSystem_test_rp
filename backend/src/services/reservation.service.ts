import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateReservationDto } from '@/dtos/update-reservation.dto';
import { CreateReservationDto } from '@/dtos/create-reservation.dto';
import { PaymentService } from './payment.service';
import { NotificationService } from './notification.service';

@Injectable()
export class ReservationService {
  constructor(
    private prisma: PrismaService,
    private payment: PaymentService,
    private notify: NotificationService,
  ) {}

async createReservation(dto: CreateReservationDto, tenantId: string) {
  // Step 0: 日時を確定（ISO → Date）
  const startDate = new Date(dto.date);
  const endDate = dto.endDate ? new Date(dto.endDate) : null;

  // Step 1: 設定取得
  const setting = await this.prisma.setting.findUnique({
    where: { tenantId },
  });

  if (setting?.useIndividualStaffSlots) {
    // Step 2: 対象スタッフ取得
    const staff = await this.prisma.staff.findUnique({
      where: { id: dto.staffId },
    });

    if (!staff?.maxSlots) {
      throw new Error('スタッフに最大予約枠が設定されていません');
    }

    // Step 3: 重複する予約数を取得
    const overlapCount = await this.prisma.reservation.count({
      where: {
        staffId: dto.staffId,
        date: {
          lte: endDate || startDate,
        },
        endDate: {
          gte: startDate,
        },
      },
    });

  if (overlapCount >= staff.maxSlots) {
    throw new Error('この時間帯はスタッフの最大予約枠を超えています');
  }
}   

  // 1. 予約本体を作成
  const reservation = await this.prisma.reservation.create({
    data: {
      customerId: dto.customerId,
      staffId: dto.staffId,
      tenantId,
      date: new Date(dto.date).toISOString(),
      endDate: dto.endDate ? new Date(dto.endDate).toISOString() : null,
      note: dto.note || null,
    },
  });

  // 2. サービスを中間テーブルに登録
  if (dto.serviceIds && dto.serviceIds.length > 0) {
    const items = dto.serviceIds.map((serviceId) => ({
      reservationId: reservation.id,
      serviceId,
    }));

    await this.prisma.reservationItem.createMany({
      data: items,
    });
  }

  return reservation;
}

async getCalendarReservations({ from, to, tenantId, staffId }: { from: string; to: string; tenantId: string; staffId?: string }) {
  const setting = await this.prisma.setting.findUnique({
    where: { tenantId },
  });

  const unit = setting?.reservationUnitMinutes ?? 60;
  const max = setting?.maxReservations ?? 3;

  const useIndividual = setting?.useIndividualStaffSlots ?? false;

  let totalMax = max;
  let defaultMax = max;

  const staffList = await this.prisma.staff.findMany({
    where: { tenantId },
    select: { id: true, maxSlots: true },
  });

  if (useIndividual) {
    totalMax = staffList.reduce((sum, s) => sum + (s.maxSlots ?? 0), 0);
    if (staffId) {
      const target = staffList.find((s) => s.id === staffId);
      defaultMax = target?.maxSlots ?? max;
    } else {
      defaultMax = totalMax;
    }
  }

  const reservations = await this.prisma.reservation.findMany({
    where: {
      tenantId,
      date: { gte: new Date(from) },
      endDate: { lte: new Date(to) },
      ...(staffId ? { staffId } : {}),
    },
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      staff: { select: { name: true } },
      reservationItems: {
        include: {
          service: { select: { name: true, duration: true, price: true } },
        },
      },
    },
    orderBy: { date: 'asc' },
  });

  const slotStats: Record<string, Record<string, { used: number; remaining: number; status: string }>> = {};

  // 日付-時間-スタッフID : 残り枠数
  const individualSlotStats: Record<string, Record<string, Record<string, number>>> = {};

  // まず、指定範囲の日付と時間帯すべてに対して各スタッフの最大枠数で初期化
  if (useIndividual) {
    const startRange = new Date(from);
    const endRange = new Date(to);
    for (let d = new Date(startRange); d <= endRange; d.setDate(d.getDate() + 1)) {
      const dayKey = d.toISOString().split('T')[0];
      if (!individualSlotStats[dayKey]) individualSlotStats[dayKey] = {};

      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60000);
      for (let t = new Date(dayStart); t < dayEnd; t.setMinutes(t.getMinutes() + unit)) {
        const timeKey = t.toTimeString().slice(0, 5);
        if (!individualSlotStats[dayKey][timeKey]) individualSlotStats[dayKey][timeKey] = {};
        for (const staff of staffList) {
          individualSlotStats[dayKey][timeKey][staff.id] = staff.maxSlots ?? 0;
        }
      }
    }
  }

  for (const res of reservations) {
    const start = new Date(res.date);
    const durationSum = res.reservationItems.reduce(
      (sum, item) => sum + (item.service?.duration || 0),
      0,
    );
    const slotCount = Math.ceil(durationSum / unit);

    for (let i = 0; i < slotCount; i++) {
      const slotTime = new Date(start.getTime() + i * unit * 60000);
      const day = slotTime.toISOString().split('T')[0];
      const time = slotTime.toTimeString().slice(0, 5);

      // 全体集計
      if (!slotStats[day]) slotStats[day] = {};
      if (!slotStats[day][time]) {
        slotStats[day][time] = { used: 0, remaining: defaultMax, status: '◎' };
      }
      slotStats[day][time].used += 1;
      slotStats[day][time].remaining = Math.max(0, defaultMax - slotStats[day][time].used);
      const remainRate = slotStats[day][time].remaining / defaultMax;
      slotStats[day][time].status =
        slotStats[day][time].used === 0 ? '◎' :
        remainRate >= 0.5 ? '〇' :
        remainRate > 0 ? '△' : '×';

      // 個別集計: 初期化済みの枠から使用数を減算
      if (useIndividual && res.staffId) {
        if (!individualSlotStats[day]) individualSlotStats[day] = {};
        if (!individualSlotStats[day][time]) {
          individualSlotStats[day][time] = {};
          for (const staff of staffList) {
            individualSlotStats[day][time][staff.id] = staff.maxSlots ?? 0;
          }
        }

        const remaining = individualSlotStats[day][time][res.staffId] ?? 0;
        individualSlotStats[day][time][res.staffId] = Math.max(0, remaining - 1);
      }
    }
  }


  return {
    reservations,
    slots: slotStats,
    totalMax,
    individualSlotStats: useIndividual ? individualSlotStats : null,
  };
}

async deleteReservation(id: string, tenantId: string) {
  const reservation = await this.prisma.reservation.findUnique({
    where: { id },
    select: { tenantId: true },
  });
  if (reservation && reservation.tenantId !== tenantId) {
    throw new ForbiddenException();
  }

  // 中間テーブルの削除（先にやる）
  await this.prisma.reservationItem.deleteMany({
    where: { reservationId: id },
  });

  // 売上レコードも削除
  await this.prisma.sale.deleteMany({ where: { reservationId: id } });

  // 本体の予約削除
  return this.prisma.reservation.delete({
    where: { id },
  });
}

async update(id: string, dto: UpdateReservationDto, tenantId: string) {
  // ① 更新前の予約を取得
  const before = await this.prisma.reservation.findUnique({
    where: { id },
    select: { tenantId: true, customerId: true, status: true },
  });
  if (before && before.tenantId !== tenantId) {
    throw new ForbiddenException();
  }

  // ② 本体予約の更新
  const updated = await this.prisma.reservation.update({
    where: { id },
    data: {
      date: new Date(dto.date),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      note: dto.note || undefined,
      staffId: dto.staffId,
      status: dto.status ?? undefined,
    },
  });

  // ② 中間テーブルを削除 → 再登録
  await this.prisma.reservationItem.deleteMany({
    where: { reservationId: id },
  });

  if (dto.serviceIds && dto.serviceIds.length > 0) {
    const items = dto.serviceIds.map((serviceId) => ({
      reservationId: id,
      serviceId,
    }));
    await this.prisma.reservationItem.createMany({ data: items });
  }

  // ③ 売上登録と決済・通知処理
  if (dto.status === 'confirmed' && before?.status !== 'confirmed') {
    const items = await this.prisma.reservationItem.findMany({
      where: { reservationId: id },
      include: { service: true },
    });
    const amount = items.reduce(
      (sum, item) => sum + (item.service?.price ?? 0),
      0,
    );
    const intent = await this.payment.createPaymentIntent(amount, id);
    await this.prisma.sale.create({
      data: {
        reservationId: id,
        amount,
        paymentIntentId: intent.id,
        paymentStatus: 'pending',
      },
    });
    if (before?.customerId) {
      const customer = await this.prisma.customer.findUnique({ where: { id: before.customerId } });
      if (customer?.email) await this.notify.sendReservationConfirmation(customer.email);
    }
  }

  if (dto.status === 'cancelled' && before?.status !== 'cancelled') {
    const sale = await this.prisma.sale.findUnique({ where: { reservationId: id } });
    if (sale) {
      const fee = Math.floor((sale.amount || 0) * 0.1);
      if (sale.paymentIntentId) {
        const refundAmount = sale.amount - fee;
        await this.payment.refundPayment(sale.paymentIntentId, refundAmount > 0 ? refundAmount : undefined);
      }
      await this.prisma.sale.update({
        where: { id: sale.id },
        data: { cancellationFee: fee, paymentStatus: 'refunded' },
      });
    }
    if (before?.customerId) {
      const customer = await this.prisma.customer.findUnique({ where: { id: before.customerId } });
      if (customer?.email) await this.notify.sendReservationCancellation(customer.email);
    }
  }

  return updated;
}

async findOne(id: string) {
  return this.prisma.reservation.findUnique({
    where: { id },
    include: {
      customer: true,
      staff: true,
      reservationItems: {
        include: {
          service: { select: { name: true, duration: true } },
        },
      },
    },
  });
}

}