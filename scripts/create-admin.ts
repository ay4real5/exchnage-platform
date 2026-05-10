import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@exchange.com';
  const password = 'Admin123!';
  const name = 'Admin User';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });
    console.log('Existing user updated to admin:', email);
  } else {
    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { email, password: hashed, name, isAdmin: true },
    });
    console.log('Admin created:', email);
  }
  console.log('Password:', password);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
