/*
  Warnings:

  - Added the required column `business_UID` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "business_UID" TEXT NOT NULL;
