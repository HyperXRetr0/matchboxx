/*
  Warnings:

  - A unique constraint covering the columns `[userId,friendId]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[friendId,userId]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Friend_userId_friendId_key" ON "Friend"("userId", "friendId");

-- CreateIndex
CREATE UNIQUE INDEX "Friend_friendId_userId_key" ON "Friend"("friendId", "userId");
