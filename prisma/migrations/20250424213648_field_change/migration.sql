/*
  Warnings:

  - Made the column `short_description` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "short_description" SET NOT NULL,
ALTER COLUMN "long_description" DROP NOT NULL;
