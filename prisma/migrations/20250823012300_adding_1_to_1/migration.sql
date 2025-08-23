/*
  Warnings:

  - A unique constraint covering the columns `[booking_id]` on the table `Request` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "BookingRequestHistory" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "BookingRequestHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Request_booking_id_key" ON "Request"("booking_id");
