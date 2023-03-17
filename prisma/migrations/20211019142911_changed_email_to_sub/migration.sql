/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - The primary key for the `Guest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Party` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `sub` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sub" TEXT NOT NULL
);
INSERT INTO "new_User" ("id") SELECT "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_sub_key" ON "User"("sub");
CREATE TABLE "new_Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "party_id" TEXT NOT NULL,
    "paid" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Guest_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "Party" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Guest" ("code", "id", "name", "paid", "party_id") SELECT "code", "id", "name", "paid", "party_id" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
CREATE UNIQUE INDEX "Guest_code_key" ON "Guest"("code");
CREATE TABLE "new_Party" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "host_id" TEXT NOT NULL,
    "cost_per_guest" INTEGER NOT NULL,
    CONSTRAINT "Party_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Party" ("cost_per_guest", "description", "host_id", "id", "name") SELECT "cost_per_guest", "description", "host_id", "id", "name" FROM "Party";
DROP TABLE "Party";
ALTER TABLE "new_Party" RENAME TO "Party";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;