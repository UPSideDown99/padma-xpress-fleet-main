/*
  Warnings:

  - You are about to drop the column `authorId` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `coverUrl` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `customer` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `booking_type` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `article` DROP FOREIGN KEY `Article_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_vehicleId_fkey`;

-- DropIndex
DROP INDEX `Article_authorId_fkey` ON `article`;

-- DropIndex
DROP INDEX `Booking_vehicleId_fkey` ON `booking`;

-- AlterTable
ALTER TABLE `article` DROP COLUMN `authorId`,
    DROP COLUMN `coverUrl`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `publishedAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `author_id` VARCHAR(191) NULL,
    ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `featured_image_url` VARCHAR(191) NULL,
    ADD COLUMN `published_at` DATETIME(3) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    ADD COLUMN `tags` JSON NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `createdAt`,
    DROP COLUMN `customer`,
    DROP COLUMN `email`,
    DROP COLUMN `endDate`,
    DROP COLUMN `note`,
    DROP COLUMN `phone`,
    DROP COLUMN `startDate`,
    DROP COLUMN `status`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `vehicleId`,
    ADD COLUMN `booking_status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    ADD COLUMN `booking_type` VARCHAR(191) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `destination` VARCHAR(191) NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `package_description` VARCHAR(191) NULL,
    ADD COLUMN `package_weight` DOUBLE NULL,
    ADD COLUMN `payment_status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    ADD COLUMN `pickup_datetime` DATETIME(3) NULL,
    ADD COLUMN `pickup_location` VARCHAR(191) NULL,
    ADD COLUMN `recipient_address` VARCHAR(191) NULL,
    ADD COLUMN `recipient_name` VARCHAR(191) NULL,
    ADD COLUMN `recipient_phone` VARCHAR(191) NULL,
    ADD COLUMN `return_datetime` DATETIME(3) NULL,
    ADD COLUMN `sender_address` VARCHAR(191) NULL,
    ADD COLUMN `sender_name` VARCHAR(191) NULL,
    ADD COLUMN `sender_phone` VARCHAR(191) NULL,
    ADD COLUMN `service_type` VARCHAR(191) NULL,
    ADD COLUMN `special_instructions` VARCHAR(191) NULL,
    ADD COLUMN `total_price` DOUBLE NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(191) NULL,
    ADD COLUMN `vehicle_selection` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `profile` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `password_hash` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'customer';

-- AlterTable
ALTER TABLE `vehicle` ADD COLUMN `vehicleCategoryId` INTEGER NULL;

-- CreateTable
CREATE TABLE `VehicleCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `base_price_per_hour` DOUBLE NULL,
    `base_price_per_day` DOUBLE NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Profile_email_key` ON `Profile`(`email`);

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_vehicleCategoryId_fkey` FOREIGN KEY (`vehicleCategoryId`) REFERENCES `VehicleCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Profile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `Profile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
