-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'ASSIGNED';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'INACTIVE';
