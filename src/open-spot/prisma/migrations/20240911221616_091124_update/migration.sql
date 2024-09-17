/*
  Warnings:

  - Added the required column `lastLoginAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentRecieved` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastLoginAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "paymentRecieved" BOOLEAN NOT NULL,
ADD COLUMN     "stripeId" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;
