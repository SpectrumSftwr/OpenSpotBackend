-- AlterEnum
ALTER TYPE "RequestStatusEnum" ADD VALUE 'COMPLETED';

-- CreateTable
CREATE TABLE "EventNotes" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "rejectionNotes" TEXT NOT NULL,

    CONSTRAINT "EventNotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventNotes_booking_id_key" ON "EventNotes"("booking_id");

-- AddForeignKey
ALTER TABLE "EventNotes" ADD CONSTRAINT "EventNotes_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "BookingDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
