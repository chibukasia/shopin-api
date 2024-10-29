/*
  Warnings:

  - The `documents` column on the `Store` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'DEACTIVATED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "documents",
ADD COLUMN     "documents" JSONB[];
