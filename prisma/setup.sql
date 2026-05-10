-- Run this in Supabase SQL Editor (https://app.supabase.com/project/_/sql)
-- Then add the environment variable to Vercel and redeploy

CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CREDITED', 'REJECTED');
CREATE TYPE "CryptoType" AS ENUM ('BTC', 'USDT', 'ETH');
CREATE TYPE "FiatCurrency" AS ENUM ('NGN', 'GBP');

CREATE TABLE "User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Transaction" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "userId" TEXT NOT NULL,
    "cryptoType" "CryptoType" NOT NULL,
    "amountCrypto" DOUBLE PRECISION NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "fiatCurrency" "FiatCurrency" NOT NULL,
    "amountFiat" DOUBLE PRECISION,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    status "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "WalletAddress" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "cryptoType" "CryptoType" NOT NULL,
    address TEXT NOT NULL,
    label TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");
CREATE INDEX "Transaction_status_idx" ON "Transaction"(status);
CREATE INDEX "WalletAddress_cryptoType_idx" ON "WalletAddress"("cryptoType");
