/*
  Warnings:

  - Added the required column `id_tipo_mov` to the `categoria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `categoria` ADD COLUMN `id_tipo_mov` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `categoria` ADD FOREIGN KEY (`id_tipo_mov`) REFERENCES `tipo_movimiento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
