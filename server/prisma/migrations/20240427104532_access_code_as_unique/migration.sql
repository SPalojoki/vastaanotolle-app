/*
  Warnings:

  - A unique constraint covering the columns `[accessCode]` on the table `Form` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Form_accessCode_key" ON "Form"("accessCode");
