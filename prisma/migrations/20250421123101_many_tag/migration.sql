/*
  Warnings:

  - You are about to drop the column `tag` on the `Painting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Painting" DROP COLUMN "tag";

-- CreateTable
CREATE TABLE "PaintingTag" (
    "id" SERIAL NOT NULL,
    "paintingId" INTEGER NOT NULL,
    "tag" "ArtTag" NOT NULL,

    CONSTRAINT "PaintingTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaintingTag_paintingId_tag_key" ON "PaintingTag"("paintingId", "tag");

-- AddForeignKey
ALTER TABLE "PaintingTag" ADD CONSTRAINT "PaintingTag_paintingId_fkey" FOREIGN KEY ("paintingId") REFERENCES "Painting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
