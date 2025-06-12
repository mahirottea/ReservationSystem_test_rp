/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `InitialSetting` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "InitialSetting" ADD COLUMN     "uuid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "InitialSetting_uuid_key" ON "InitialSetting"("uuid");
