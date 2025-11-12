/*
  Warnings:

  - A unique constraint covering the columns `[title,tagId]` on the table `Status` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,taskId]` on the table `Subtask` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,userId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,statusId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Status_title_tagId_key" ON "Status"("title", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Subtask_title_taskId_key" ON "Subtask"("title", "taskId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_title_userId_key" ON "Tag"("title", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Task_title_statusId_key" ON "Task"("title", "statusId");
