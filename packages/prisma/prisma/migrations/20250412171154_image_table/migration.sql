/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "donation" DROP CONSTRAINT "donation_category_id_fkey";

-- DropTable
DROP TABLE "Category";

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "filename" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "donationId" TEXT,

    CONSTRAINT "image_pkey" PRIMARY KEY ("filename","hash")
);

-- AddForeignKey
ALTER TABLE "donation" ADD CONSTRAINT "donation_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "donation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
