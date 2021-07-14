/*
  Warnings:

  - Added the required column `id_usuario` to the `cuenta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cuenta` ADD COLUMN `id_usuario` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `cuenta` ADD FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
