/*
  Warnings:

  - You are about to drop the column `annuityChargeRule` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `annuityValue` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `feesChargeRule` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `feesValue` on the `Card` table. All the data in the column will be lost.
  - Added the required column `annuity` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chargeRule` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fees` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "annuityChargeRule",
DROP COLUMN "annuityValue",
DROP COLUMN "feesChargeRule",
DROP COLUMN "feesValue",
ADD COLUMN     "annuity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "chargeRule" TEXT NOT NULL,
ADD COLUMN     "fees" DOUBLE PRECISION NOT NULL;
