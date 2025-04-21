-- CreateEnum
CREATE TYPE "PaintingState" AS ENUM ('FOR_SALE', 'OFF_SALE');

-- CreateEnum
CREATE TYPE "ArtTag" AS ENUM ('ANIMAL', 'PERSONNAGE', 'PAYSAGE', 'COMMANDE_PERSONNALISEE');

-- CreateTable
CREATE TABLE "Painting" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DECIMAL(65,30) NOT NULL,
    "image" TEXT NOT NULL,
    "state" "PaintingState" NOT NULL DEFAULT 'FOR_SALE',
    "slug" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "width" DECIMAL(65,30) NOT NULL,
    "height" DECIMAL(65,30) NOT NULL,
    "paintingType" TEXT NOT NULL,

    CONSTRAINT "Painting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaintingTag" (
    "id" SERIAL NOT NULL,
    "paintingId" INTEGER NOT NULL,
    "tag" "ArtTag" NOT NULL,

    CONSTRAINT "PaintingTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" DECIMAL(65,30),
    "startDate" TIMESTAMP(3) NOT NULL,
    "showStartTime" BOOLEAN NOT NULL DEFAULT true,
    "endDate" TIMESTAMP(3),
    "showEndTime" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT,
    "url" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Painting_slug_key" ON "Painting"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PaintingTag_paintingId_tag_key" ON "PaintingTag"("paintingId", "tag");

-- AddForeignKey
ALTER TABLE "PaintingTag" ADD CONSTRAINT "PaintingTag_paintingId_fkey" FOREIGN KEY ("paintingId") REFERENCES "Painting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
