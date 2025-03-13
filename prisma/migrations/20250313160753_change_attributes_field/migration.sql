/*
  Warnings:

  - You are about to drop the `_AttributeToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AttributeToProduct" DROP CONSTRAINT "_AttributeToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_AttributeToProduct" DROP CONSTRAINT "_AttributeToProduct_B_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "attributes" JSONB[];

-- DropTable
DROP TABLE "_AttributeToProduct";
