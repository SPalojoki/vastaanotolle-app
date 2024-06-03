-- DropIndex
DROP INDEX "Form_accessCode_key";

-- AlterTable
ALTER TABLE "Form" ALTER COLUMN "isRemoved" SET DEFAULT false;
