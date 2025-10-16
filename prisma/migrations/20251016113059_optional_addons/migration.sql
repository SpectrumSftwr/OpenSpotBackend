/*
  Warnings:

  - You are about to drop the `EventReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventSurvey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SurveyResponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SurveyTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventReview" DROP CONSTRAINT "EventReview_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventSurvey" DROP CONSTRAINT "EventSurvey_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "EventSurvey" DROP CONSTRAINT "EventSurvey_surveyTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyResponse" DROP CONSTRAINT "SurveyResponse_eventSurveyId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyTemplate" DROP CONSTRAINT "SurveyTemplate_createdByBusinesssId_fkey";

-- DropTable
DROP TABLE "EventReview";

-- DropTable
DROP TABLE "EventSurvey";

-- DropTable
DROP TABLE "SurveyResponse";

-- DropTable
DROP TABLE "SurveyTemplate";

-- DropEnum
DROP TYPE "ReviewStatus";

-- DropEnum
DROP TYPE "SurveyStatus";

-- CreateTable
CREATE TABLE "OptionalAddOns" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "businessId" INTEGER NOT NULL,
    "bookingDetailsId" INTEGER NOT NULL,

    CONSTRAINT "OptionalAddOns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OptionalAddOns" ADD CONSTRAINT "OptionalAddOns_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionalAddOns" ADD CONSTRAINT "OptionalAddOns_bookingDetailsId_fkey" FOREIGN KEY ("bookingDetailsId") REFERENCES "BookingDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
