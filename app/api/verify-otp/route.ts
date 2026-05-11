export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp } = body ?? {};

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.verifyToken || !user.verifyTokenExpiry) {
      return NextResponse.json({ error: 'No pending verification found' }, { status: 400 });
    }

    if (new Date() > user.verifyTokenExpiry) {
      return NextResponse.json({ error: 'Code expired — please sign up again' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(otp, user.verifyToken);
    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect code — please try again' }, { status: 400 });
    }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date(), verifyToken: null, verifyTokenExpiry: null },
    });

    return NextResponse.json({ message: 'Email verified' }, { status: 200 });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
