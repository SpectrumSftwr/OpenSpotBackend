/*
  Warnings:

  - A unique constraint covering the columns `[confirmationId]` on the table `BookingDetails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[confirmationId]` on the table `Request` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `confirmationId` to the `BookingDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confirmationId` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookingDetails" ADD COLUMN     "confirmationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "confirmationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BookingDetails_confirmationId_key" ON "BookingDetails"("confirmationId");

-- CreateIndex
CREATE UNIQUE INDEX "Request_confirmationId_key" ON "Request"("confirmationId");
