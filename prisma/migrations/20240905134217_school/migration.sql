/*
  Warnings:

  - Added the required column `city` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `school` ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `zipCode` VARCHAR(191) NOT NULL;
