/*
  Warnings:

  - Added the required column `clerk_user_id` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "clerk_user_id" TEXT NOT NULL;
