/*
  Warnings:

  - You are about to drop the column `product_id` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `child_categories` on the `ProductCategory` table. All the data in the column will be lost.
  - You are about to drop the column `parent_category` on the `ProductCategory` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Attribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attribute" DROP CONSTRAINT "Attribute_product_id_fkey";

-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "product_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductCategory" DROP COLUMN "child_categories",
DROP COLUMN "parent_category",
ADD COLUMN     "parent_category_id" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_AttributeToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AttributeToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AttributeToProduct_B_index" ON "_AttributeToProduct"("B");

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeToProduct" ADD CONSTRAINT "_AttributeToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeToProduct" ADD CONSTRAINT "_AttributeToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
