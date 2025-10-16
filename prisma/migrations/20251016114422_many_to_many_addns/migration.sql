/*
  Warnings:

  - You are about to drop the column `bookingDetailsId` on the `OptionalAddOns` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OptionalAddOns" DROP CONSTRAINT "OptionalAddOns_bookingDetailsId_fkey";

-- AlterTable
ALTER TABLE "OptionalAddOns" DROP COLUMN "bookingDetailsId";

-- CreateTable
CREATE TABLE "_BookingDetailsToOptionalAddOns" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookingDetailsToOptionalAddOns_AB_unique" ON "_BookingDetailsToOptionalAddOns"("A", "B");

-- CreateIndex
CREATE INDEX "_BookingDetailsToOptionalAddOns_B_index" ON "_BookingDetailsToOptionalAddOns"("B");

-- AddForeignKey
ALTER TABLE "_BookingDetailsToOptionalAddOns" ADD CONSTRAINT "_BookingDetailsToOptionalAddOns_A_fkey" FOREIGN KEY ("A") REFERENCES "BookingDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingDetailsToOptionalAddOns" ADD CONSTRAINT "_BookingDetailsToOptionalAddOns_B_fkey" FOREIGN KEY ("B") REFERENCES "OptionalAddOns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
