export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = (session.user as any)?.id;

    const [allTxs, creditedTxs] = await Promise.all([
      prisma.transaction.findMany({ where: { userId } }),
      prisma.transaction.findMany({ where: { userId, status: 'CREDITED' } }),
    ]);

    const totalFiat = creditedTxs.reduce((sum, tx) => sum + (tx.amountFiat ?? 0), 0);
    const totalNonRejected = allTxs.filter((t) => t.status !== 'REJECTED').length;
    const successRate = allTxs.length > 0 ? Math.round((totalNonRejected / allTxs.length) * 100) : 100;

    return NextResponse.json({ totalSent: allTxs.length, totalFiat, successRate, creditedCount: creditedTxs.length });
  } catch {
    return NextResponse.json({ totalSent: 0, totalFiat: 0, successRate: 100, creditedCount: 0 });
  }
}
