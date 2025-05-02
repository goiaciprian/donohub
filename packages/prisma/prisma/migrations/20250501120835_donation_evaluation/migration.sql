-- CreateTable
CREATE TABLE "donation_evaluation" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "userImage" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "donation_id" TEXT NOT NULL,

    CONSTRAINT "donation_evaluation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "donation_evaluation" ADD CONSTRAINT "donation_evaluation_donation_id_fkey" FOREIGN KEY ("donation_id") REFERENCES "donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
