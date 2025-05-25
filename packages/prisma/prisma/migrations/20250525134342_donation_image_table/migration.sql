/*
  Warnings:

  - You are about to drop the column `donationId` on the `image` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "image" DROP CONSTRAINT "image_donationId_fkey";

-- AlterTable
ALTER TABLE "image" DROP COLUMN "donationId";

-- CreateTable
CREATE TABLE "donation_image" (
    "id" TEXT NOT NULL,
    "donation_id" TEXT NOT NULL,
    "image_filename" TEXT NOT NULL,
    "image_hash" TEXT NOT NULL,

    CONSTRAINT "donation_image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "donation_image" ADD CONSTRAINT "donation_image_donation_id_fkey" FOREIGN KEY ("donation_id") REFERENCES "donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_image" ADD CONSTRAINT "donation_image_image_filename_image_hash_fkey" FOREIGN KEY ("image_filename", "image_hash") REFERENCES "image"("filename", "hash") ON DELETE RESTRICT ON UPDATE CASCADE;
