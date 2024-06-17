/*
  Warnings:

  - You are about to drop the column `stage` on the `Order` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NO_ACK', 'WAITING_FOR_ACK', 'VALIDATED');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "stage",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'NO_ACK';

-- DropEnum
DROP TYPE "Stage";
