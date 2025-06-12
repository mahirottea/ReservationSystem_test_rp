/*
  Warnings:

  - The `businessDays` column on the `Setting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `closedDays` column on the `Setting` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "businessDays",
ADD COLUMN     "businessDays" TEXT[],
DROP COLUMN "closedDays",
ADD COLUMN     "closedDays" TEXT[];
