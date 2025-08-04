/*
  Warnings:

  - Added the required column `business_id` to the `Trigger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trigger" ADD COLUMN     "business_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
