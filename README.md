# CryptoXchange - Crypto to Fiat Exchange Platform

A modern web application for converting cryptocurrency (BTC, USDT, ETH) to fiat currency (NGN, GBP). Phase 1 implements manual verification and processing.

## Features

### User Features
- **Registration & Login** - Secure email/password authentication
- **Wallet Display** - View admin's crypto deposit addresses (BTC, USDT)
- **Transaction Submission** - Submit crypto payment details including:
  - Cryptocurrency type and amount sent
  - Transaction hash for verification
  - Preferred fiat currency (NGN or GBP)
  - Bank account details for fiat receipt
- **Transaction History** - Track status of all submitted transactions

### Admin Features
- **Dashboard Overview** - Stats on users, transactions by status
- **Wallet Management** - Add, edit, delete crypto wallet addresses
- **Transaction Management** - Review, confirm, reject, and mark transactions as credited
- **Admin Notes** - Add notes to transactions for record keeping

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js v4
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Radix UI primitives

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Yarn package manager

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd exchange_platform/nextjs_space
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and NextAuth secret
```

4. Push database schema:
```bash
yarn prisma generate
yarn prisma db push
```

5. Seed the database:
```bash
yarn prisma db seed
```

6. Run the development server:
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js session encryption |
| `NEXTAUTH_URL` | Application URL (e.g., http://localhost:3000) |

## Admin Access

- **Email**: admin@cryptoxchange.com
- **Password**: admin@2026

## Transaction Workflow

1. **User sends crypto** to displayed wallet address
2. **User submits transaction** with hash and bank details
3. **Admin verifies** the transaction on blockchain
4. **Admin confirms** and enters fiat amount
5. **Admin sends fiat** and marks as credited

## Phase 2 (Planned)
- Automatic blockchain payment detection via APIs
- Automatic fiat crediting
- Real-time exchange rate quotes
- Multi-currency support expansion

## Project Structure

```
app/
├── page.tsx                    # Landing page
├── login/                      # Login page
├── signup/                     # Signup page
├── dashboard/                  # User dashboard
│   └── _components/
│       ├── wallet-display.tsx   # Shows deposit addresses
│       ├── transaction-form.tsx # Submit transaction
│       └── transaction-history.tsx
├── admin/                      # Admin dashboard
│   └── _components/
│       ├── admin-stats.tsx      # Overview statistics
│       ├── wallet-manager.tsx   # CRUD wallet addresses
│       └── transaction-manager.tsx # Process transactions
└── api/
    ├── signup/                 # User registration
    ├── auth/                   # NextAuth + login
    ├── wallets/                # Wallet CRUD
    ├── transactions/           # Transaction CRUD
    └── admin/stats/            # Admin statistics
```
