/*
  Warnings:

  - Made the column `tag` on table `Painting` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Painting" ALTER COLUMN "tag" SET NOT NULL;
