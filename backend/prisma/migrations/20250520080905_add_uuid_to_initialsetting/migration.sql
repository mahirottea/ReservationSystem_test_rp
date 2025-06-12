/*
  Warnings:

  - Made the column `uuid` on table `InitialSetting` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "InitialSetting" ALTER COLUMN "uuid" SET NOT NULL;
