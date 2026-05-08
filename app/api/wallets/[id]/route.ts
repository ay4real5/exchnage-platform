export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any)?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const body = await req.json();
    const { cryptoType, address, label, isActive } = body ?? {};
    const wallet = await prisma.walletAddress.update({
      where: { id: params?.id },
      data: {
        ...(cryptoType !== undefined && { cryptoType }),
        ...(address !== undefined && { address }),
        ...(label !== undefined && { label }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    return NextResponse.json(wallet);
  } catch (error: any) {
    console.error('Update wallet error:', error);
    return NextResponse.json({ error: 'Failed to update wallet' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any)?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    await prisma.walletAddress.delete({ where: { id: params?.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete wallet error:', error);
    return NextResponse.json({ error: 'Failed to delete wallet' }, { status: 500 });
  }
}
