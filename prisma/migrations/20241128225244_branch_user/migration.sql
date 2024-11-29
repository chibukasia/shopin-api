/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Branch_user_id_key" ON "Branch"("user_id");
