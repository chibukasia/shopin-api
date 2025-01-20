/*
  Warnings:

  - You are about to drop the column `shipping_method` on the `Order` table. All the data in the column will be lost.
  - Added the required column `shipping_method_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shipping_method",
ADD COLUMN     "shipping_method_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shipping_method_id_fkey" FOREIGN KEY ("shipping_method_id") REFERENCES "ShippingMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
