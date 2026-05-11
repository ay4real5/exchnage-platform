export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import { prisma } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body ?? {};

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const hashedPassword = await bcrypt.hash(password, 12);

    if (existingUser && !existingUser.emailVerified) {
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword, name, verifyToken: hashedOTP, verifyTokenExpiry: expiry },
      });
    } else {
      await prisma.user.create({
        data: { email, password: hashedPassword, name, verifyToken: hashedOTP, verifyTokenExpiry: expiry },
      });
    }

    await resend.emails.send({
      from: 'CryptoXchange <onboarding@resend.dev>',
      to: email,
      subject: 'Your verification code',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#07070f;color:#fff;padding:40px;border-radius:16px">
          <h2 style="margin:0 0 8px;font-size:22px">Verify your email</h2>
          <p style="color:#71717a;margin:0 0 32px;font-size:14px">Enter this code in the CryptoXchange signup flow. It expires in 10 minutes.</p>
          <div style="text-align:center;background:#101020;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:32px;margin-bottom:32px">
            <p style="letter-spacing:12px;font-size:36px;font-weight:800;color:#fff;margin:0">${otp}</p>
          </div>
          <p style="color:#52525b;font-size:12px;margin:0">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'OTP sent' }, { status: 201 });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
