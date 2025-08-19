/*
  Warnings:

  - You are about to drop the column `posterAvailable` on the `Painting` table. All the data in the column will be lost.
  - You are about to drop the `PosterSize` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PosterSize" DROP CONSTRAINT "PosterSize_paintingId_fkey";

-- AlterTable
ALTER TABLE "public"."Painting" DROP COLUMN "posterAvailable";

-- DropTable
DROP TABLE "public"."PosterSize";

-- CreateTable
CREATE TABLE "public"."GlobalPosterSize" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "width" DECIMAL(65,30) NOT NULL,
    "height" DECIMAL(65,30) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalPosterSize_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GlobalPosterSize_name_key" ON "public"."GlobalPosterSize"("name");
