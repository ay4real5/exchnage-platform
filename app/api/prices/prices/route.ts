export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether,ethereum&vs_currencies=usd&include_24hr_change=true',
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error('CoinGecko API error');
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      bitcoin: { usd: 64000, usd_24h_change: 1.2 },
      tether: { usd: 1.0, usd_24h_change: 0.01 },
      ethereum: { usd: 3400, usd_24h_change: -0.5 },
    });
  }
}
