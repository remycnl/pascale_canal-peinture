-- CreateTable
CREATE TABLE "Painting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DECIMAL NOT NULL,
    "image" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'FOR_SALE',
    "slug" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Painting_slug_key" ON "Painting"("slug");
