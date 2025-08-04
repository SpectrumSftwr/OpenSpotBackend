-- CreateEnum
CREATE TYPE "TriggerTypes" AS ENUM ('USER_BASED', 'TIME_BASED');

-- CreateTable
CREATE TABLE "Trigger" (
    "id" SERIAL NOT NULL,
    "type" "TriggerTypes" NOT NULL,
    "eventType" TEXT NOT NULL,
    "condition" JSONB NOT NULL,
    "workflowId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workflow" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "steps" JSONB[],
    "createdByUserId" INTEGER,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Templates" (
    "id" SERIAL NOT NULL,
    "templateString" TEXT NOT NULL,

    CONSTRAINT "Templates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
