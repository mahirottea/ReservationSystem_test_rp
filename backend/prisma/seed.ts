import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL },
  },
});

async function main() {
  await prisma.$transaction([
    prisma.rememberToken.deleteMany(),
    prisma.reservationItem.deleteMany(),
    prisma.reservation.deleteMany(),
    prisma.sale.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.service.deleteMany(),
    prisma.staff.deleteMany(),
    prisma.setting.deleteMany(),
    prisma.coupon.deleteMany(),
    prisma.ticketType.deleteMany(),
    prisma.event.deleteMany(),
    prisma.carItem.deleteMany(),
    prisma.carSetting.deleteMany(),
    prisma.timeSlotPrice.deleteMany(),
    prisma.seatType.deleteMany(),
    prisma.schoolLesson.deleteMany(),
    prisma.instructor.deleteMany(),
    prisma.schoolSetting.deleteMany(),
    prisma.questionnaire.deleteMany(),
    prisma.attendanceRecord.deleteMany(),
    prisma.user.deleteMany(),
    prisma.tenant.deleteMany(),
  ]);

  const email = process.env.SETUP_EMAIL;
  const password = process.env.SETUP_PASSWORD;

  if (!email || !password) {
    throw new Error('SETUP_EMAIL and SETUP_PASSWORD must be defined');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name: 'Setup User',
      email,
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log(`Created setup user for ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
