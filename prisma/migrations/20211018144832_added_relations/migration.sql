-- CreateTable
CREATE TABLE "Party" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "host_id" INTEGER NOT NULL,
    "cost_per_guest" INTEGER NOT NULL,
    CONSTRAINT "Party_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "party_id" INTEGER NOT NULL,
    "paid" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Guest_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "Party" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_code_key" ON "Guest"("code");
