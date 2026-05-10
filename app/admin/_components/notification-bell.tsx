'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, BellRing } from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NotificationBell() {
  const { data, mutate } = useSWR('/api/admin/notifications', fetcher, { refreshInterval: 5000 });
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unreadCount = data?.unreadCount ?? 0;

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const markAll = async () => {
    await fetch('/api/admin/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ all: true }) });
    mutate();
  };

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(!open)}
        className="relative h-10 w-10 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
      >
        {unreadCount > 0 ? (
          <BellRing className="h-[18px] w-[18px] text-amber-400" />
        ) : (
          <Bell className="h-[18px] w-[18px]" />
        )}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 h-4 min-w-[16px] rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center px-1"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-[320px] rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <span className="text-xs font-semibold text-zinc-300">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAll} className="text-[10px] text-zinc-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <Check className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-[320px] overflow-y-auto scrollbar-none">
              {(data?.notifications ?? []).length === 0 && (
                <div className="px-4 py-6 text-center text-xs text-zinc-500">No notifications yet</div>
              )}
              {(data?.notifications ?? []).map((n: any) => (
                <button
                  key={n.id}
                  onClick={() => {
                    if (!n.readAt) {
                      fetch('/api/admin/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: n.id }) });
                      mutate();
                    }
                  }}
                  className="w-full text-left px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    {!n.readAt && <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />}
                    <span className="text-[11px] text-zinc-300">
                      {n.transaction?.amountCrypto} {n.transaction?.cryptoType} → {n.transaction?.fiatCurrency}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">
                    {n.transaction?.user?.name || 'Unknown'} • {relativeTime(n.createdAt)}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
