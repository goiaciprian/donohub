/*
  Warnings:

  - You are about to drop the column `rating` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `user_info_id` on the `comment` table. All the data in the column will be lost.
  - Added the required column `rating` to the `donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_info_id` to the `donation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_user_info_id_fkey";

-- AlterTable
ALTER TABLE "comment" DROP COLUMN "rating",
DROP COLUMN "user_info_id",
ADD COLUMN     "userInfoId" TEXT;

-- AlterTable
ALTER TABLE "donation" ADD COLUMN     "rating" SMALLINT NOT NULL,
ADD COLUMN     "user_info_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "donation" ADD CONSTRAINT "donation_user_info_id_fkey" FOREIGN KEY ("user_info_id") REFERENCES "user_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_userInfoId_fkey" FOREIGN KEY ("userInfoId") REFERENCES "user_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
