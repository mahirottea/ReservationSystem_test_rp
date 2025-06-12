-- AlterTable
ALTER TABLE "Setting" ADD COLUMN     "useIndividualStaffSlots" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "maxSlots" INTEGER NOT NULL DEFAULT 3;
