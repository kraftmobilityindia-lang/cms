-- CreateEnum
CREATE TYPE "public"."complaint_category" AS ENUM ('ELECTRICAL', 'PLUMBING', 'ELECTRONICS', 'CARPENTRY', 'STRUCTURAL', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."complaint_status" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "Image" TEXT,
    "propertyId" TEXT NOT NULL,
    "otpCode" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."properties" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "fullAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL DEFAULT 0,
    "bathrooms" INTEGER NOT NULL DEFAULT 0,
    "hasLivingArea" BOOLEAN NOT NULL DEFAULT false,
    "hasDiningArea" BOOLEAN NOT NULL DEFAULT false,
    "hasKitchen" BOOLEAN NOT NULL DEFAULT true,
    "hasUtility" BOOLEAN NOT NULL DEFAULT false,
    "hasGarden" BOOLEAN NOT NULL DEFAULT false,
    "hasPowderRoom" BOOLEAN NOT NULL DEFAULT false,
    "propertyType" TEXT,
    "area" DOUBLE PRECISION,
    "floor" INTEGER,
    "totalFloors" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."complaints" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "category" "public"."complaint_category" NOT NULL,
    "status" "public"."complaint_status" NOT NULL DEFAULT 'OPEN',
    "priority" "public"."priority" NOT NULL DEFAULT 'MEDIUM',
    "issueImages" TEXT[],
    "issueVideos" TEXT[],
    "beforeImages" TEXT[],
    "afterImages" TEXT[],
    "beforeVideos" TEXT[],
    "afterVideos" TEXT[],
    "workDescription" TEXT,
    "materialsUsed" TEXT,
    "workNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."otps" (
    "id" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media_files" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "complaintId" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."app_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "public"."users"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "app_config_key_key" ON "public"."app_config"("key");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."complaints" ADD CONSTRAINT "complaints_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."complaints" ADD CONSTRAINT "complaints_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
