export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body ?? {};

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 });
  } catch (error: any) {
    console.error('Signup error:', error);
    const message = error?.message || 'Something went wrong';
    const code = error?.code;
    return NextResponse.json(
      {
        error: code ? `${message} (code: ${code})` : message,
        details: error?.meta || undefined,
      },
      { status: 500 }
    );
  }
}
