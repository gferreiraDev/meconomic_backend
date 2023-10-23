-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_cardId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseInstallment" DROP CONSTRAINT "PurchaseInstallment_purchaseId_fkey";

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInstallment" ADD CONSTRAINT "PurchaseInstallment_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
