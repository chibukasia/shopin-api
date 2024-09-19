/*
  Warnings:

  - The `documents` column on the `Store` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Store" DROP COLUMN "documents",
ADD COLUMN     "documents" TEXT[];
