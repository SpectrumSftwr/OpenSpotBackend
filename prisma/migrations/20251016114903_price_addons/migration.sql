/*
  Warnings:

  - Added the required column `price` to the `OptionalAddOns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OptionalAddOns" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
