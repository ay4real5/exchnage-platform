import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed admin user (test account)
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: { isAdmin: true },
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      password: hashedPassword,
      isAdmin: true,
    },
  });

  // Seed additional admin account
  const adminPassword = await bcrypt.hash('admin@2026', 12);
  await prisma.user.upsert({
    where: { email: 'admin@cryptoxchange.com' },
    update: { isAdmin: true },
    create: {
      email: 'admin@cryptoxchange.com',
      name: 'CryptoXchange Admin',
      password: adminPassword,
      isAdmin: true,
    },
  });

  // Seed sample wallet addresses
  const wallets = [
    {
      cryptoType: 'BTC' as const,
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      label: 'Primary BTC Wallet',
    },
    {
      cryptoType: 'USDT' as const,
      address: 'TJYeasTPa6gpDFBKuRsXXKLgbqVrait7Yn',
      label: 'Primary USDT Wallet (TRC20)',
    },
  ];

  for (const wallet of wallets) {
    const existing = await prisma.walletAddress.findFirst({
      where: { cryptoType: wallet.cryptoType, address: wallet.address },
    });
    if (!existing) {
      await prisma.walletAddress.create({ data: wallet });
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
