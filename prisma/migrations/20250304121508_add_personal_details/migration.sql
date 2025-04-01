/*
  Warnings:

  - Added the required column `personal_details` to the `BookingDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookingDetails" ADD COLUMN     "personal_details" JSONB NOT NULL;
