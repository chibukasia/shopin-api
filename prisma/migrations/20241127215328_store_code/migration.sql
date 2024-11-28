/*
  Warnings:

  - A unique constraint covering the columns `[store_code]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `store_code` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "store_code" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "branch_name" TEXT NOT NULL,
    "description" TEXT,
    "branch_code" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "operational_hours" JSONB NOT NULL,
    "address" TEXT NOT NULL,
    "county_or_province" TEXT NOT NULL,
    "town" TEXT,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Branch_branch_code_key" ON "Branch"("branch_code");

-- CreateIndex
CREATE UNIQUE INDEX "Store_store_code_key" ON "Store"("store_code");

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
