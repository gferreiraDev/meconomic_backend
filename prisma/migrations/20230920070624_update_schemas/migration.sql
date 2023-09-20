/*
  Warnings:

  - You are about to drop the column `cardId` on the `Statement` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[statementId]` on the table `Card` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Statement" DROP CONSTRAINT "Statement_cardId_fkey";

-- DropIndex
DROP INDEX "Statement_cardId_key";

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "statementId" TEXT;

-- AlterTable
ALTER TABLE "Statement" DROP COLUMN "cardId";

-- CreateIndex
CREATE UNIQUE INDEX "Card_statementId_key" ON "Card"("statementId");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "Statement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
