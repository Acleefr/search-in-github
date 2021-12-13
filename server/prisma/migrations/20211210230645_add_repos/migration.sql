-- CreateTable
CREATE TABLE "Repos" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT,
    "description" TEXT,
    "updated_at" TIMESTAMP(3),
    "visibility" VARCHAR(255) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Repos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Repos" ADD CONSTRAINT "Repos_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
