/*
  Warnings:

  - The values [RADIO] on the enum `QuestionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `title` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `reportText` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Question` table. All the data in the column will be lost.
  - Added the required column `answerCount` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('FI', 'SE');

-- AlterEnum
BEGIN;
CREATE TYPE "QuestionType_new" AS ENUM ('TEXT', 'MULTIPLE_CHOICE');
ALTER TABLE "Question" ALTER COLUMN "type" TYPE "QuestionType_new" USING ("type"::text::"QuestionType_new");
ALTER TYPE "QuestionType" RENAME TO "QuestionType_old";
ALTER TYPE "QuestionType_new" RENAME TO "QuestionType";
DROP TYPE "QuestionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "title",
ALTER COLUMN "published" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "reportText",
DROP COLUMN "text";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "text",
ADD COLUMN     "answerCount" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "FormTranslation" (
    "id" SERIAL NOT NULL,
    "formId" INTEGER NOT NULL,
    "language" "Language" NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "FormTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionTranslation" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "language" "Language" NOT NULL,
    "text" TEXT NOT NULL,
    "reportText" TEXT NOT NULL,

    CONSTRAINT "QuestionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionTranslation" (
    "id" SERIAL NOT NULL,
    "optionId" INTEGER NOT NULL,
    "language" "Language" NOT NULL,
    "text" TEXT NOT NULL,
    "reportText" TEXT NOT NULL,

    CONSTRAINT "OptionTranslation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FormTranslation" ADD CONSTRAINT "FormTranslation_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionTranslation" ADD CONSTRAINT "QuestionTranslation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionTranslation" ADD CONSTRAINT "OptionTranslation_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
