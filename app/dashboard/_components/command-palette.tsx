'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Send,
  Wallet,
  History,
  Home,
  LogOut,
  ArrowRightLeft,
  Copy,
  TrendingUp,
  Settings,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onOpenChange]);

  const run = (action: () => void) => {
    onOpenChange(false);
    setTimeout(action, 150);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." className="text-white" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => run(() => router.push('/dashboard'))}>
            <Home className="mr-2 h-4 w-4" /> Dashboard
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push('/dashboard?send=1'))}>
            <Send className="mr-2 h-4 w-4" /> Send Crypto
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push('/dashboard?wallets=1'))}>
            <Wallet className="mr-2 h-4 w-4" /> Wallets
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push('/dashboard/history'))}>
            <History className="mr-2 h-4 w-4" /> Transaction History
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(() => router.push('/dashboard?send=1&crypto=BTC'))}>
            <ArrowRightLeft className="mr-2 h-4 w-4" /> Quick Send BTC
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push('/dashboard?wallets=1'))}>
            <Copy className="mr-2 h-4 w-4" /> Copy Wallet Address
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem onSelect={() => run(() => signOut({ callbackUrl: '/' }))}>
            <LogOut className="mr-2 h-4 w-4 text-rose-400" />
            <span className="text-rose-400">Sign Out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
