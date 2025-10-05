-- AlterTable
ALTER TABLE "BusinessFAQs" ADD COLUMN     "coreQ" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "BusinessPackage" ADD COLUMN     "userCreatedPackage" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PackageItemOnPackage" ADD COLUMN     "businessId" INTEGER NOT NULL DEFAULT -1;

-- AddForeignKey
ALTER TABLE "PackageItemOnPackage" ADD CONSTRAINT "PackageItemOnPackage_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
