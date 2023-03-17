/*
  Warnings:

  - A unique constraint covering the columns `[name,host_id]` on the table `Party` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Party_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Party_name_host_id_key" ON "Party"("name", "host_id");
