-- AlterTable
ALTER TABLE "public"."Painting" ADD COLUMN     "posterAvailable" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "public"."PosterSize" (
    "id" SERIAL NOT NULL,
    "paintingId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "width" DECIMAL(65,30) NOT NULL,
    "height" DECIMAL(65,30) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PosterSize_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PosterSize_paintingId_name_key" ON "public"."PosterSize"("paintingId", "name");

-- AddForeignKey
ALTER TABLE "public"."PosterSize" ADD CONSTRAINT "PosterSize_paintingId_fkey" FOREIGN KEY ("paintingId") REFERENCES "public"."Painting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
