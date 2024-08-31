-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'USER', 'MODERATOR', 'SELLER');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Roles" NOT NULL,
    "shopId" INTEGER,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shops" (
    "shop_id" SERIAL NOT NULL,
    "shop_name" TEXT NOT NULL,
    "shop_description" TEXT,
    "shop_turnover" INTEGER NOT NULL,
    "shop_average_price" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Shops_pkey" PRIMARY KEY ("shop_id")
);

-- CreateTable
CREATE TABLE "Products" (
    "product_id" SERIAL NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_description" TEXT NOT NULL,
    "product_price" INTEGER NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "ShopsProducts" (
    "productId" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,

    CONSTRAINT "ShopsProducts_pkey" PRIMARY KEY ("productId","shopId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shops_userId_key" ON "Shops"("userId");

-- AddForeignKey
ALTER TABLE "Shops" ADD CONSTRAINT "Shops_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopsProducts" ADD CONSTRAINT "ShopsProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopsProducts" ADD CONSTRAINT "ShopsProducts_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shops"("shop_id") ON DELETE RESTRICT ON UPDATE CASCADE;
