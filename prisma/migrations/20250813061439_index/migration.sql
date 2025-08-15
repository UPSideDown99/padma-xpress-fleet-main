-- CreateIndex
CREATE INDEX `Article_status_idx` ON `Article`(`status`);

-- CreateIndex
CREATE INDEX `Article_published_at_idx` ON `Article`(`published_at`);

-- CreateIndex
CREATE INDEX `Vehicle_status_idx` ON `Vehicle`(`status`);

-- CreateIndex
CREATE INDEX `Vehicle_category_idx` ON `Vehicle`(`category`);
