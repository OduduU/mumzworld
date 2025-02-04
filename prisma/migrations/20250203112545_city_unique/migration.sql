/*
  Warnings:

  - A unique constraint covering the columns `[city]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Favorite_city_key" ON "Favorite"("city");
