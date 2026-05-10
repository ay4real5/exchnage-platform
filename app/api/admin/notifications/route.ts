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

    const [unreadCount, recent] = await Promise.all([
      prisma.adminNotification.count({ where: { readAt: null } }),
      prisma.adminNotification.findMany({
        where: {},
        include: {
          transaction: {
            include: { user: { select: { id: true, name: true, email: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    return NextResponse.json({ unreadCount, notifications: recent });
  } catch (error: any) {
    console.error('Notifications error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any)?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const body = await req.json();
    const { id, all } = body ?? {};

    if (all) {
      await prisma.adminNotification.updateMany({
        where: { readAt: null },
        data: { readAt: new Date() },
      });
    } else if (id) {
      await prisma.adminNotification.update({
        where: { id },
        data: { readAt: new Date() },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Mark read error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
