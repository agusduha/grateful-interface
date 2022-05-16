/*
  Warnings:

  - A unique constraint covering the columns `[user,creator]` on the table `Label` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Label_user_creator_key" ON "Label"("user", "creator");
