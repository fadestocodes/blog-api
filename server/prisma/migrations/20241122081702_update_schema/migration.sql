/*
  Warnings:

  - Added the required column `title` to the `Blogpost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blogpost" ADD COLUMN     "title" TEXT NOT NULL;
