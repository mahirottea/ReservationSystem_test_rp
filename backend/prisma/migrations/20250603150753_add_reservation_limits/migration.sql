-- AlterTable
ALTER TABLE "Setting" ADD COLUMN     "maxReservations" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "reservationUnitMinutes" INTEGER NOT NULL DEFAULT 60;
