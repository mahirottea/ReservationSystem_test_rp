/*
  Warnings:

  - A unique constraint covering the columns `[tenantId]` on the table `Coupon` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Coupon_tenantId_key" ON "Coupon"("tenantId");
