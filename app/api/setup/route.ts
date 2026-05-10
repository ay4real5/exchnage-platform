import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET() {
  const email = 'admin@exchange.com';
  const password = 'Admin123!';
  const name = 'Admin User';

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      await prisma.user.update({
        where: { email },
        data: { isAdmin: true },
      });
      return NextResponse.json({ ok: true, message: 'Existing user updated to admin', email, password });
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { email, password: hashed, name, isAdmin: true },
    });
    return NextResponse.json({ ok: true, message: 'Admin created', email, password });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
