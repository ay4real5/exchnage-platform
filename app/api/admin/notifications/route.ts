export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any)?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // AdminNotification table doesn't exist - return empty
    return NextResponse.json({ unreadCount: 0, notifications: [] });
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
    // AdminNotification table doesn't exist - return success
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Mark read error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
