export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any)?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [totalUsers, totalTransactions, pendingCount, confirmedCount, creditedCount, rejectedCount] = await Promise.all([
      prisma.user.count({ where: { isAdmin: false } }),
      prisma.transaction.count(),
      prisma.transaction.count({ where: { status: 'PENDING' } }),
      prisma.transaction.count({ where: { status: 'CONFIRMED' } }),
      prisma.transaction.count({ where: { status: 'CREDITED' } }),
      prisma.transaction.count({ where: { status: 'REJECTED' } }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalTransactions,
      pendingCount,
      confirmedCount,
      creditedCount,
      rejectedCount,
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
