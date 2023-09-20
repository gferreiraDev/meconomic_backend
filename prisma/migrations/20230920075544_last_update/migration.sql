-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_statementId_fkey";

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "Statement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
