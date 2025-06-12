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
  await prisma.rememberToken.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  const salon = await prisma.tenant.create({
    data: {
      name: 'Demo Salon',
      email: 'salon@example.com',
      type: 'salon',
    },
  });

  const clinic = await prisma.tenant.create({
    data: {
      name: 'Demo Clinic',
      email: 'clinic@example.com',
      type: 'clinic',
    },
  });

  const password = await bcrypt.hash('password', 10);

  await prisma.user.create({
    data: {
      name: 'Salon Admin',
      email: 'admin@salon.example.com',
      password,
      tenantId: salon.id,
      role: 'admin',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Clinic Admin',
      email: 'admin@clinic.example.com',
      password,
      tenantId: clinic.id,
      role: 'admin',
    },
  });

  await prisma.service.createMany({
    data: [
      {
        name: 'Hair Cut',
        duration: 60,
        price: 5000,
        allowMultiple: false,
        tenantId: salon.id,
      },
      {
        name: 'Hair Color',
        duration: 120,
        price: 10000,
        allowMultiple: false,
        tenantId: salon.id,
      },
      {
        name: 'Initial Consultation',
        duration: 30,
        price: 3000,
        allowMultiple: false,
        tenantId: clinic.id,
      },
      {
        name: 'Follow-up Visit',
        duration: 20,
        price: 1500,
        allowMultiple: false,
        tenantId: clinic.id,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
