-- CreateEnum
CREATE TYPE "SurveyStatus" AS ENUM ('PENDING', 'COMPLETED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'COMPLETED', 'EXPIRED');

-- CreateTable
CREATE TABLE "SurveyTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "createdByBusinesssId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurveyTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSurvey" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "surveyTemplateId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "status" "SurveyStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" SERIAL NOT NULL,
    "eventSurveyId" INTEGER NOT NULL,
    "responses" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventReview" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "comment" TEXT,
    "rating" INTEGER,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EventReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventSurvey_bookingId_key" ON "EventSurvey"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "EventSurvey_token_key" ON "EventSurvey"("token");

-- CreateIndex
CREATE UNIQUE INDEX "EventReview_token_key" ON "EventReview"("token");

-- AddForeignKey
ALTER TABLE "SurveyTemplate" ADD CONSTRAINT "SurveyTemplate_createdByBusinesssId_fkey" FOREIGN KEY ("createdByBusinesssId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSurvey" ADD CONSTRAINT "EventSurvey_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "BookingDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSurvey" ADD CONSTRAINT "EventSurvey_surveyTemplateId_fkey" FOREIGN KEY ("surveyTemplateId") REFERENCES "SurveyTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_eventSurveyId_fkey" FOREIGN KEY ("eventSurveyId") REFERENCES "EventSurvey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventReview" ADD CONSTRAINT "EventReview_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "BookingDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
