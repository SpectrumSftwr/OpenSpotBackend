-- AlterTable
ALTER TABLE "Trigger" ADD COLUMN     "createdByUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
