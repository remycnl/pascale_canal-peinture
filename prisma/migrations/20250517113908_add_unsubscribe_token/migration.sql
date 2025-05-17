/*
  Warnings:

  - You are about to drop the column `isVerified` on the `NewsletterSubscriber` table. All the data in the column will be lost.
  - You are about to drop the column `verificationToken` on the `NewsletterSubscriber` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[unsubscribeToken]` on the table `NewsletterSubscriber` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "NewsletterSubscriber" DROP COLUMN "isVerified",
DROP COLUMN "verificationToken",
ADD COLUMN     "unsubscribeToken" TEXT,
ADD COLUMN     "unsubscribedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_unsubscribeToken_key" ON "NewsletterSubscriber"("unsubscribeToken");
