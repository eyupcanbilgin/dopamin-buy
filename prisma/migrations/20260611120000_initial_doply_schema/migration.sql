-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('HOME', 'WORK', 'FAMILY', 'RANDOM');

-- CreateEnum
CREATE TYPE "SimulationPaymentMethod" AS ENUM ('SIMULATED_DOPLY_CARD', 'SIMULATED_CASH_ON_DELIVERY', 'COMPLETE_WITHOUT_SPENDING');

-- CreateEnum
CREATE TYPE "UrgeTrigger" AS ENUM ('BOREDOM', 'STRESS', 'REWARD_SEEKING', 'SOCIAL_MEDIA', 'SALE_ANXIETY', 'LATE_NIGHT', 'DISCOUNT_FEAR', 'SELF_REWARD', 'SALARY_DAY', 'SADNESS', 'LONELINESS', 'HABIT', 'OTHER');

-- CreateEnum
CREATE TYPE "SimulationOrderStatus" AS ENUM ('STARTED', 'COMPLETED', 'PAUSED', 'JOURNALED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'CONVERTED_TO_SIMULATION', 'CLEARED');

-- CreateEnum
CREATE TYPE "AdSlotPlacement" AS ENUM ('HOME', 'SHOP_HOME', 'CATEGORY', 'PRODUCT_DETAIL', 'CART_REVIEW', 'CHECKOUT_SUCCESS', 'HOMEPAGE_BANNER', 'CATEGORY_MID_FEED', 'SIDEBAR_DESKTOP', 'FOOTER', 'GUIDE_INLINE');

-- CreateEnum
CREATE TYPE "ContentPageType" AS ENUM ('LANDING', 'ETHICS', 'HELP', 'PRIVACY', 'TERMS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "displayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnonymousSession" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnonymousSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isFictional" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "compareAtPriceCents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "rating" DECIMAL(2,1) NOT NULL DEFAULT 4.4,
    "dopamineScore" DECIMAL(3,1) NOT NULL DEFAULT 4.5,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "merchantName" TEXT,
    "simulatedDeliveryEstimate" TEXT,
    "popularityScore" INTEGER NOT NULL DEFAULT 50,
    "stockFeelingLabel" TEXT,
    "campaignLabel" TEXT,
    "catalogSource" TEXT NOT NULL DEFAULT 'import',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "searchKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImportHistory" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "importedCount" INTEGER NOT NULL DEFAULT 0,
    "skippedCount" INTEGER NOT NULL DEFAULT 0,
    "duplicateCount" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductImportHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "summary" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE',
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPriceCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationOrder" (
    "id" TEXT NOT NULL,
    "simulationNumber" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "cartId" TEXT,
    "status" "SimulationOrderStatus" NOT NULL DEFAULT 'STARTED',
    "totalValueCents" INTEGER NOT NULL,
    "savedMoneyCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "addressType" "AddressType",
    "deliveryCity" TEXT,
    "deliveryDistrict" TEXT,
    "generatedFictionalAddress" TEXT,
    "simulationPaymentMethod" "SimulationPaymentMethod",
    "urgeScoreBefore" INTEGER,
    "urgeScoreAfter" INTEGER,
    "completedAt" TIMESTAMP(3),
    "pausedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulationOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationOrderItem" (
    "id" TEXT NOT NULL,
    "simulationOrderId" TEXT NOT NULL,
    "productId" TEXT,
    "productName" TEXT NOT NULL,
    "brandName" TEXT,
    "categoryName" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPriceCents" INTEGER NOT NULL,
    "totalPriceCents" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulationOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UrgeCheckIn" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "simulationOrderId" TEXT,
    "score" INTEGER NOT NULL,
    "trigger" "UrgeTrigger",
    "note" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UrgeCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UrgeJournalEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "simulationOrderId" TEXT,
    "trigger" "UrgeTrigger",
    "urgeScoreBefore" INTEGER,
    "urgeScoreAfter" INTEGER,
    "savedMoneyCents" INTEGER,
    "reflection" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UrgeJournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedMoneyEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "simulationOrderId" TEXT,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedMoneyEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdSlot" (
    "id" TEXT NOT NULL,
    "placement" "AdSlotPlacement" NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT 'Sponsorlu',
    "sponsorName" TEXT,
    "ctaLabel" TEXT,
    "ctaHref" TEXT,
    "frequencyCap" INTEGER NOT NULL DEFAULT 3,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentPage" (
    "id" TEXT NOT NULL,
    "type" "ContentPageType" NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "body" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AnonymousSession_sessionToken_key" ON "AnonymousSession"("sessionToken");

-- CreateIndex
CREATE INDEX "AnonymousSession_userId_idx" ON "AnonymousSession"("userId");

-- CreateIndex
CREATE INDEX "AnonymousSession_sessionToken_idx" ON "AnonymousSession"("sessionToken");

-- CreateIndex
CREATE INDEX "AnonymousSession_expiresAt_idx" ON "AnonymousSession"("expiresAt");

-- CreateIndex
CREATE INDEX "AnonymousSession_lastSeenAt_idx" ON "AnonymousSession"("lastSeenAt");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_isActive_sortOrder_idx" ON "Category"("isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateIndex
CREATE INDEX "Brand_slug_idx" ON "Brand"("slug");

-- CreateIndex
CREATE INDEX "Brand_name_idx" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_brandId_idx" ON "Product"("brandId");

-- CreateIndex
CREATE INDEX "Product_categoryId_isActive_idx" ON "Product"("categoryId", "isActive");

-- CreateIndex
CREATE INDEX "Product_brandId_isActive_idx" ON "Product"("brandId", "isActive");

-- CreateIndex
CREATE INDEX "Product_priceCents_idx" ON "Product"("priceCents");

-- CreateIndex
CREATE INDEX "Product_catalogSource_idx" ON "Product"("catalogSource");

-- CreateIndex
CREATE INDEX "Product_popularityScore_idx" ON "Product"("popularityScore");

-- CreateIndex
CREATE INDEX "Product_searchKeywords_idx" ON "Product"("searchKeywords");

-- CreateIndex
CREATE INDEX "ProductImage_productId_idx" ON "ProductImage"("productId");

-- CreateIndex
CREATE INDEX "ProductImage_productId_sortOrder_idx" ON "ProductImage"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProductImportHistory_source_idx" ON "ProductImportHistory"("source");

-- CreateIndex
CREATE INDEX "ProductImportHistory_provider_idx" ON "ProductImportHistory"("provider");

-- CreateIndex
CREATE INDEX "ProductImportHistory_createdAt_idx" ON "ProductImportHistory"("createdAt");

-- CreateIndex
CREATE INDEX "AdminAuditLog_action_idx" ON "AdminAuditLog"("action");

-- CreateIndex
CREATE INDEX "AdminAuditLog_entityType_idx" ON "AdminAuditLog"("entityType");

-- CreateIndex
CREATE INDEX "AdminAuditLog_entityId_idx" ON "AdminAuditLog"("entityId");

-- CreateIndex
CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Cart_userId_idx" ON "Cart"("userId");

-- CreateIndex
CREATE INDEX "Cart_sessionId_idx" ON "Cart"("sessionId");

-- CreateIndex
CREATE INDEX "Cart_status_idx" ON "Cart"("status");

-- CreateIndex
CREATE INDEX "Cart_sessionId_status_idx" ON "Cart"("sessionId", "status");

-- CreateIndex
CREATE INDEX "CartItem_cartId_idx" ON "CartItem"("cartId");

-- CreateIndex
CREATE INDEX "CartItem_productId_idx" ON "CartItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productId_key" ON "CartItem"("cartId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationOrder_simulationNumber_key" ON "SimulationOrder"("simulationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationOrder_cartId_key" ON "SimulationOrder"("cartId");

-- CreateIndex
CREATE INDEX "SimulationOrder_simulationNumber_idx" ON "SimulationOrder"("simulationNumber");

-- CreateIndex
CREATE INDEX "SimulationOrder_userId_idx" ON "SimulationOrder"("userId");

-- CreateIndex
CREATE INDEX "SimulationOrder_sessionId_idx" ON "SimulationOrder"("sessionId");

-- CreateIndex
CREATE INDEX "SimulationOrder_status_idx" ON "SimulationOrder"("status");

-- CreateIndex
CREATE INDEX "SimulationOrder_sessionId_status_idx" ON "SimulationOrder"("sessionId", "status");

-- CreateIndex
CREATE INDEX "SimulationOrder_createdAt_idx" ON "SimulationOrder"("createdAt");

-- CreateIndex
CREATE INDEX "SimulationOrderItem_simulationOrderId_idx" ON "SimulationOrderItem"("simulationOrderId");

-- CreateIndex
CREATE INDEX "SimulationOrderItem_productId_idx" ON "SimulationOrderItem"("productId");

-- CreateIndex
CREATE INDEX "UrgeCheckIn_userId_idx" ON "UrgeCheckIn"("userId");

-- CreateIndex
CREATE INDEX "UrgeCheckIn_sessionId_idx" ON "UrgeCheckIn"("sessionId");

-- CreateIndex
CREATE INDEX "UrgeCheckIn_simulationOrderId_idx" ON "UrgeCheckIn"("simulationOrderId");

-- CreateIndex
CREATE INDEX "UrgeCheckIn_checkedAt_idx" ON "UrgeCheckIn"("checkedAt");

-- CreateIndex
CREATE INDEX "UrgeJournalEntry_userId_idx" ON "UrgeJournalEntry"("userId");

-- CreateIndex
CREATE INDEX "UrgeJournalEntry_sessionId_idx" ON "UrgeJournalEntry"("sessionId");

-- CreateIndex
CREATE INDEX "UrgeJournalEntry_simulationOrderId_idx" ON "UrgeJournalEntry"("simulationOrderId");

-- CreateIndex
CREATE INDEX "UrgeJournalEntry_trigger_idx" ON "UrgeJournalEntry"("trigger");

-- CreateIndex
CREATE INDEX "SavedMoneyEvent_userId_idx" ON "SavedMoneyEvent"("userId");

-- CreateIndex
CREATE INDEX "SavedMoneyEvent_sessionId_idx" ON "SavedMoneyEvent"("sessionId");

-- CreateIndex
CREATE INDEX "SavedMoneyEvent_simulationOrderId_idx" ON "SavedMoneyEvent"("simulationOrderId");

-- CreateIndex
CREATE INDEX "SavedMoneyEvent_createdAt_idx" ON "SavedMoneyEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdSlot_slug_key" ON "AdSlot"("slug");

-- CreateIndex
CREATE INDEX "AdSlot_placement_idx" ON "AdSlot"("placement");

-- CreateIndex
CREATE INDEX "AdSlot_isActive_placement_idx" ON "AdSlot"("isActive", "placement");

-- CreateIndex
CREATE INDEX "AdSlot_placement_isActive_sortOrder_idx" ON "AdSlot"("placement", "isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ContentPage_slug_key" ON "ContentPage"("slug");

-- CreateIndex
CREATE INDEX "ContentPage_type_idx" ON "ContentPage"("type");

-- CreateIndex
CREATE INDEX "ContentPage_slug_idx" ON "ContentPage"("slug");

-- CreateIndex
CREATE INDEX "ContentPage_isPublished_idx" ON "ContentPage"("isPublished");

-- AddForeignKey
ALTER TABLE "AnonymousSession" ADD CONSTRAINT "AnonymousSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AnonymousSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationOrder" ADD CONSTRAINT "SimulationOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationOrder" ADD CONSTRAINT "SimulationOrder_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AnonymousSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationOrder" ADD CONSTRAINT "SimulationOrder_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationOrderItem" ADD CONSTRAINT "SimulationOrderItem_simulationOrderId_fkey" FOREIGN KEY ("simulationOrderId") REFERENCES "SimulationOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationOrderItem" ADD CONSTRAINT "SimulationOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrgeCheckIn" ADD CONSTRAINT "UrgeCheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrgeCheckIn" ADD CONSTRAINT "UrgeCheckIn_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AnonymousSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrgeCheckIn" ADD CONSTRAINT "UrgeCheckIn_simulationOrderId_fkey" FOREIGN KEY ("simulationOrderId") REFERENCES "SimulationOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrgeJournalEntry" ADD CONSTRAINT "UrgeJournalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrgeJournalEntry" ADD CONSTRAINT "UrgeJournalEntry_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AnonymousSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrgeJournalEntry" ADD CONSTRAINT "UrgeJournalEntry_simulationOrderId_fkey" FOREIGN KEY ("simulationOrderId") REFERENCES "SimulationOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedMoneyEvent" ADD CONSTRAINT "SavedMoneyEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedMoneyEvent" ADD CONSTRAINT "SavedMoneyEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AnonymousSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedMoneyEvent" ADD CONSTRAINT "SavedMoneyEvent_simulationOrderId_fkey" FOREIGN KEY ("simulationOrderId") REFERENCES "SimulationOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
