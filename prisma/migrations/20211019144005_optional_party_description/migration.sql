-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Party" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "host_id" TEXT NOT NULL,
    "cost_per_guest" INTEGER NOT NULL,
    CONSTRAINT "Party_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Party" ("cost_per_guest", "description", "host_id", "id", "name") SELECT "cost_per_guest", "description", "host_id", "id", "name" FROM "Party";
DROP TABLE "Party";
ALTER TABLE "new_Party" RENAME TO "Party";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
