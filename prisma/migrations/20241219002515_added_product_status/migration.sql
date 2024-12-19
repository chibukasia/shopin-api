-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DELETED', 'ACTIVE', 'SOLD', 'DEACTIVATED');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE';
