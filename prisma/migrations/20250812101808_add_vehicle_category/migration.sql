/*
  Warnings:

  - You are about to drop the column `base_price_per_day` on the `vehiclecategory` table. All the data in the column will be lost.
  - You are about to drop the column `base_price_per_hour` on the `vehiclecategory` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `vehiclecategory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `VehicleCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `vehiclecategory` DROP COLUMN `base_price_per_day`,
    DROP COLUMN `base_price_per_hour`,
    DROP COLUMN `description`;

-- CreateIndex
CREATE UNIQUE INDEX `VehicleCategory_name_key` ON `VehicleCategory`(`name`);
