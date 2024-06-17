/*
  Warnings:

  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('NO_ACK', 'WAITING_FOR_ACK', 'VALIDATED');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "status",
ADD COLUMN     "stage" "Stage" NOT NULL DEFAULT 'NO_ACK';
