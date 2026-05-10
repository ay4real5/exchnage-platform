export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { formatDistanceToNow } from 'date-fns';

export async function GET() {
  try {
    const txs = await prisma.transaction.findMany({
      where: { status: 'CREDITED' },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: { user: { select: { name: true } } },
    });

    const activity = txs.map((tx) => {
      const name = tx.user?.name?.split(' ')[0] ?? 'Someone';
      const amount = tx.amountFiat ?? 0;
      const symbol = tx.fiatCurrency === 'NGN' ? '₦' : '£';
      const maskedAmount = symbol + '***' + (amount > 0 ? amount.toString().slice(-3) : '000');
      return {
        text: `${name} received ${maskedAmount}`,
        time: formatDistanceToNow(new Date(tx.updatedAt), { addSuffix: true }),
      };
    });

    return NextResponse.json(activity);
  } catch (error: any) {
    console.error('Activity error:', error);
    return NextResponse.json([
      { text: 'Platform activity loading...', time: 'just now' },
    ]);
  }
}
