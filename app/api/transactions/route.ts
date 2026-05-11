export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { notify } from '@/lib/notify';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const status = searchParams?.get('status');
    const isAdmin = (session.user as any)?.isAdmin;
    const userId = (session.user as any)?.id;

    const where: any = {};
    if (!isAdmin) {
      where.userId = userId;
    }
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(transactions);
  } catch (error: any) {
    console.error('Fetch transactions error:', error);
    const message = error?.message || 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch transactions', details: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const { cryptoType, amountCrypto, transactionHash, fiatCurrency, bankName, accountNumber, accountName } = body ?? {};

    if (!cryptoType || !amountCrypto || !transactionHash || !fiatCurrency || !bankName || !accountNumber || !accountName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: (session.user as any)?.id,
        cryptoType,
        amountCrypto: parseFloat(amountCrypto),
        transactionHash,
        fiatCurrency,
        bankName,
        accountNumber,
        accountName,
      },
    });

    // Fetch with user data for notifications
    const txWithUser = await prisma.transaction.findUnique({
      where: { id: transaction.id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (txWithUser) {
      notify(txWithUser).catch(() => {}); // fail-silent
    }

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    console.error('Create transaction error:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
