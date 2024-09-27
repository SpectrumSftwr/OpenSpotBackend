-- CreateTable
CREATE TABLE "SiteColors" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "background" TEXT NOT NULL,
    "foreground" TEXT NOT NULL,
    "accent" TEXT NOT NULL,
    "secondary" TEXT NOT NULL,

    CONSTRAINT "SiteColors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLinks" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT,
    "href" TEXT NOT NULL,

    CONSTRAINT "UserLinks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteColors_userId_key" ON "SiteColors"("userId");

-- AddForeignKey
ALTER TABLE "SiteColors" ADD CONSTRAINT "SiteColors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLinks" ADD CONSTRAINT "UserLinks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
