'use client';

import { PortfolioOverview } from './portfolio-overview';
import { ConversionCalculator } from './conversion-calculator';
import { TransactionTimeline } from './transaction-timeline';
import { InsightsFeed } from './insights-feed';

export function DashboardOverview() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Main content */}
      <div className="xl:col-span-8 space-y-6">
        <PortfolioOverview />
        <ConversionCalculator />
        <TransactionTimeline limit={5} showViewAll />
      </div>

      {/* Right sidebar */}
      <div className="xl:col-span-4 space-y-6">
        <InsightsFeed />
      </div>
    </div>
  );
}
