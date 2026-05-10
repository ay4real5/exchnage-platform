import { prisma } from '@/lib/db';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function getExplorerUrl(hash: string, type: string) {
  if (type === 'BTC') return `https://mempool.space/tx/${hash}`;
  if (type === 'ETH') return `https://etherscan.io/tx/${hash}`;
  return `https://tronscan.org/#/transaction/${hash}`;
}

async function createInAppNotification(tx: any) {
  try {
    await prisma.adminNotification.create({
      data: { transactionId: tx.id },
    });
  } catch (e) { console.error('In-app notify error:', e); }
}

async function sendAdminEmail(tx: any) {
  if (!RESEND_API_KEY || !ADMIN_EMAIL) return;
  try {
    const Resend = (await import('resend')).Resend;
    const resend = new Resend(RESEND_API_KEY);
    const usdValue = tx.amountCrypto * (tx.cryptoType === 'BTC' ? 64000 : tx.cryptoType === 'ETH' ? 3400 : 1);
    const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://exchange-platform.vercel.app'}/admin`;

    await resend.emails.send({
      from: 'Exchange <notifications@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `New transaction: ${tx.amountCrypto} ${tx.cryptoType} → ${tx.fiatCurrency}`,
      html: `
        <div style="font-family:system-ui, sans-serif; max-width:500px; padding:24px; background:#0a0a0a; color:#fff; border-radius:16px;">
          <h2 style="margin-top:0; font-size:20px;">New Transaction Initiated</h2>
          <p><strong>Customer:</strong> ${tx.user?.name || 'Unknown'} (${tx.user?.email || ''})</p>
          <p><strong>Amount:</strong> ${tx.amountCrypto} ${tx.cryptoType} (≈ $${usdValue.toLocaleString()})</p>
          <p><strong>Payout:</strong> ${tx.fiatCurrency} to ${tx.bankName}</p>
          <p><strong>Account:</strong> ${tx.accountNumber} • ${tx.accountName}</p>
          <p><strong>Hash:</strong> <a href="${getExplorerUrl(tx.transactionHash, tx.cryptoType)}" style="color:#60a5fa;">${tx.transactionHash}</a></p>
          <a href="${adminUrl}" style="display:inline-block; margin-top:16px; padding:10px 20px; background:linear-gradient(135deg,#6366f1,#ec4899); color:#fff; text-decoration:none; border-radius:10px; font-weight:600;">Open in Admin</a>
        </div>
      `,
    });
  } catch (e) { console.error('Email notify error:', e); }
}

async function sendTelegram(tx: any) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    const usdValue = tx.amountCrypto * (tx.cryptoType === 'BTC' ? 64000 : tx.cryptoType === 'ETH' ? 3400 : 1);
    const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://exchange-platform.vercel.app'}/admin`;
    const text = `🔔 *New Transaction*

👤 *Customer:* ${tx.user?.name || 'Unknown'}
📧 ${tx.user?.email || ''}

💰 *Amount:* ${tx.amountCrypto} ${tx.cryptoType}
💵 ≈ $${usdValue.toLocaleString()}

🏦 *Payout:* ${tx.fiatCurrency} → ${tx.bankName}
👤 *Account:* ${tx.accountNumber} • ${tx.accountName}

🔗 *Hash:* \`${tx.transactionHash}\``;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[{ text: 'Open Admin →', url: adminUrl }]],
        },
      }),
    });
  } catch (e) { console.error('Telegram notify error:', e); }
}

export async function notify(transaction: any) {
  await Promise.allSettled([
    createInAppNotification(transaction),
    sendAdminEmail(transaction),
    sendTelegram(transaction),
  ]);
}
