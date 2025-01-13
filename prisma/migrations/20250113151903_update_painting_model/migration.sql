/*
  Warnings:

  - You are about to drop the column `type` on the `Painting` table. All the data in the column will be lost.
  - Added the required column `artist` to the `Painting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `Painting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paintingType` to the `Painting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag` to the `Painting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Painting` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Painting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DECIMAL NOT NULL,
    "image" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'FOR_SALE',
    "slug" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "width" DECIMAL NOT NULL,
    "height" DECIMAL NOT NULL,
    "paintingType" TEXT NOT NULL
);
INSERT INTO "new_Painting" ("date", "id", "image", "name", "price", "slug", "state") SELECT "date", "id", "image", "name", "price", "slug", "state" FROM "Painting";
DROP TABLE "Painting";
ALTER TABLE "new_Painting" RENAME TO "Painting";
CREATE UNIQUE INDEX "Painting_slug_key" ON "Painting"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
