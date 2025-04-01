-- CreateEnum
CREATE TYPE "RequestStatusEnum" AS ENUM ('PENDING', 'APPROVED', 'PAID', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "stripe_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "business_name" TEXT NOT NULL,
    "business_type" TEXT NOT NULL,
    "business_banner_url" TEXT,
    "profile_picture_url" TEXT,
    "profileDescription" TEXT,
    "contact_info" JSONB,
    "theme_id" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessGallery" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "BusinessGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessReviews" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "BusinessReviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessFAQs" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "BusinessFAQs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessPackage" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "package_image_url" TEXT NOT NULL,
    "duration_in_minutes" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "features" TEXT[],

    CONSTRAINT "BusinessPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "status" "RequestStatusEnum" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingDetails" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "guest_count" INTEGER NOT NULL,
    "duration_in_minutes" INTEGER NOT NULL,
    "event_type" TEXT NOT NULL,
    "package_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Business_user_id_key" ON "Business"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessGallery_business_id_key" ON "BusinessGallery"("business_id");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessGallery" ADD CONSTRAINT "BusinessGallery_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessReviews" ADD CONSTRAINT "BusinessReviews_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessFAQs" ADD CONSTRAINT "BusinessFAQs_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessPackage" ADD CONSTRAINT "BusinessPackage_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "BookingDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingDetails" ADD CONSTRAINT "BookingDetails_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingDetails" ADD CONSTRAINT "BookingDetails_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "BusinessPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
