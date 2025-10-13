-- AlterTable
ALTER TABLE "BookingDetails" ADD COLUMN     "dueBy" TIMESTAMP(3),
ADD COLUMN     "totalEventPrice" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "PackageItemOnPackage" ALTER COLUMN "businessId" DROP DEFAULT;

-- CreateTable
CREATE TABLE "BookingPayments" (
    "id" SERIAL NOT NULL,
    "businessId" INTEGER NOT NULL,
    "bookingDetailsId" INTEGER NOT NULL,
    "amountPayed" DOUBLE PRECISION NOT NULL,
    "payedOn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingPayments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookingPayments" ADD CONSTRAINT "BookingPayments_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingPayments" ADD CONSTRAINT "BookingPayments_bookingDetailsId_fkey" FOREIGN KEY ("bookingDetailsId") REFERENCES "BookingDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
