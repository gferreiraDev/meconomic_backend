/*
  Warnings:

  - Made the column `statementId` on table `Card` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "statementId" SET NOT NULL;
