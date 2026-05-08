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
    const { status, adminNote, amountFiat } = body ?? {};

    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminNote !== undefined) updateData.adminNote = adminNote;
    if (amountFiat !== undefined) updateData.amountFiat = parseFloat(amountFiat);

    const transaction = await prisma.transaction.update({
      where: { id: params?.id },
      data: updateData,
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json(transaction);
  } catch (error: any) {
    console.error('Update transaction error:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}
