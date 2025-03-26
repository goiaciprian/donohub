-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location" (
    "id" TEXT NOT NULL,
    "street" TEXT,
    "number" TEXT,
    "city" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "postal_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_info" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "rating" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" TEXT,
    "phone" TEXT,
    "clerk_user_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "rating" SMALLINT NOT NULL,
    "text" TEXT NOT NULL,
    "donation_id" TEXT NOT NULL,
    "user_info_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_info_clerk_user_id_idx" ON "user_info"("clerk_user_id");

-- CreateIndex
CREATE INDEX "donation_clerk_user_id_idx" ON "donation"("clerk_user_id");

-- CreateIndex
CREATE INDEX "comment_clerk_user_id_idx" ON "comment"("clerk_user_id");

-- AddForeignKey
ALTER TABLE "donation" ADD CONSTRAINT "donation_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation" ADD CONSTRAINT "donation_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_donation_id_fkey" FOREIGN KEY ("donation_id") REFERENCES "donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_info_id_fkey" FOREIGN KEY ("user_info_id") REFERENCES "user_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
