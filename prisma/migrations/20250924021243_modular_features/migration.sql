/*
  Warnings:

  - You are about to drop the column `features` on the `BusinessPackage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BusinessPackage" DROP COLUMN "features";

-- CreateTable
CREATE TABLE "BusinessPackageItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BusinessPackageItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageItemOnPackage" (
    "packageId" INTEGER NOT NULL,
    "packageItemId" INTEGER NOT NULL,
    "orderIndex" INTEGER,

    CONSTRAINT "PackageItemOnPackage_pkey" PRIMARY KEY ("packageId","packageItemId")
);

-- AddForeignKey
ALTER TABLE "PackageItemOnPackage" ADD CONSTRAINT "PackageItemOnPackage_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "BusinessPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageItemOnPackage" ADD CONSTRAINT "PackageItemOnPackage_packageItemId_fkey" FOREIGN KEY ("packageItemId") REFERENCES "BusinessPackageItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
