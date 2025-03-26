/*
  Warnings:

  - You are about to drop the column `userInfoId` on the `comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_userInfoId_fkey";

-- AlterTable
ALTER TABLE "comment" DROP COLUMN "userInfoId";
