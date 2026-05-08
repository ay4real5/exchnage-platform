export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const wallets = await prisma.walletAddress.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(wallets);
  } catch (error: any) {
    console.error('Fetch wallets error:', error);
    return NextResponse.json({ error: 'Failed to fetch wallets' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any)?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const body = await req.json();
    const { cryptoType, address, label } = body ?? {};
    if (!cryptoType || !address) {
      return NextResponse.json({ error: 'Crypto type and address are required' }, { status: 400 });
    }
    const wallet = await prisma.walletAddress.create({
      data: { cryptoType, address, label: label || null },
    });
    return NextResponse.json(wallet, { status: 201 });
  } catch (error: any) {
    console.error('Create wallet error:', error);
    return NextResponse.json({ error: 'Failed to create wallet' }, { status: 500 });
  }
}
