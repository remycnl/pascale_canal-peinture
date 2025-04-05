-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "showEndTime" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showStartTime" BOOLEAN NOT NULL DEFAULT true;
