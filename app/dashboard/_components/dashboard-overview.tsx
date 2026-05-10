'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PortfolioOverview } from './portfolio-overview';
import { QuickConvert } from './quick-convert';
import { TransactionStream } from './transaction-stream';
import { ActivityFeed } from './activity-feed';
import { SendDrawer } from './send-drawer';
import { WalletDrawer } from './wallet-drawer';
import { FloatingFab } from './floating-fab';

export function DashboardOverview() {
  const searchParams = useSearchParams();
  const [sendOpen, setSendOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [prefillCrypto, setPrefillCrypto] = useState<string | undefined>();
  const [prefillAmount, setPrefillAmount] = useState<string | undefined>();

  useEffect(() => {
    const send = searchParams?.get('send');
    const wallets = searchParams?.get('wallets');
    const crypto = searchParams?.get('crypto');
    const amount = searchParams?.get('amount');
    if (send === '1') { setPrefillCrypto(crypto ?? undefined); setPrefillAmount(amount ?? undefined); setSendOpen(true); }
    if (wallets === '1') setWalletOpen(true);
  }, [searchParams]);

  const openSend = (crypto?: string, amount?: string) => {
    setPrefillCrypto(crypto);
    setPrefillAmount(amount);
    setSendOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PortfolioOverview />
        </div>
        <div>
          <QuickConvert onSend={(crypto, amount) => openSend(crypto, amount)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TransactionStream limit={6} />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>

      <FloatingFab onClick={() => openSend()} />
      <SendDrawer open={sendOpen} onClose={() => setSendOpen(false)} prefillCrypto={prefillCrypto} prefillAmount={prefillAmount} />
      <WalletDrawer open={walletOpen} onClose={() => setWalletOpen(false)} onSend={(crypto) => openSend(crypto)} />
    </div>
  );
}
