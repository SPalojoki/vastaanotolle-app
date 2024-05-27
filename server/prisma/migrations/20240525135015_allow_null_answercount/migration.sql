-- AlterTable
ALTER TABLE "Form" ALTER COLUMN "published" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "answerCount" DROP NOT NULL;
