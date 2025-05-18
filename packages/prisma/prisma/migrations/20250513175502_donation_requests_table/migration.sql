-- CreateTable
CREATE TABLE "DonationRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "donationId" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "userImage" TEXT NOT NULL,
    "userName" TEXT NOT NULL,

    CONSTRAINT "DonationRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DonationRequest" ADD CONSTRAINT "DonationRequest_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
