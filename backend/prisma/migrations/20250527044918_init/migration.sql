/*
  Warnings:

  - You are about to drop the `InitialSetting` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "allowMultiple" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Setting" ADD COLUMN     "allowNomination" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "businessDays" TEXT,
ADD COLUMN     "closedDays" TEXT,
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "notifyReminder" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifyReservation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requireEmail" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requirePhone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startTime" TEXT;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "selectable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "specialties" TEXT;

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "address" TEXT,
ADD COLUMN     "type" TEXT NOT NULL;

-- DropTable
DROP TABLE "InitialSetting";

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "firstTime" INTEGER NOT NULL,
    "repeat" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
