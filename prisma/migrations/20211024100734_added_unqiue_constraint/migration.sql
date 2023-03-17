/*
  Warnings:

  - You are about to drop the column `code` on the `Guest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Party` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Guest_code_key";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "party_id" TEXT NOT NULL,
    "paid" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Guest_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "Party" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Guest" ("id", "name", "paid", "party_id") SELECT "id", "name", "paid", "party_id" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
CREATE UNIQUE INDEX "Guest_name_party_id_key" ON "Guest"("name", "party_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Party_name_key" ON "Party"("name");
