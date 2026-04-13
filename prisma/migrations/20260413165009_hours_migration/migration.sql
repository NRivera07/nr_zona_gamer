-- CreateTable
CREATE TABLE "Hours" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hours_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Hours" ADD CONSTRAINT "Hours_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
