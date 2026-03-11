'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3,
  Activity,
  Bell,
  Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ModelCost {
  model: string;
  cost: number;
  requests: number;
}

export interface DailyCost {
  date: string;
  cost: number;
}

export interface EndpointCost {
  endpoint: string;
  cost: number;
  calls: number;
}

export interface CostData {
  totalCost: number;
  costByModel: ModelCost[];
  dailyCosts: DailyCost[];
  topEndpoints: EndpointCost[];
  averageCostPerRequest: number;
  projectedMonthlyCost: number;
  previousPeriodCost: number;
}

export interface CostTrackerDashboardProps {
  costs: CostData;
  budget?: number;
  period: string;
  onPeriodChange: (period: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const AnimatedCurrency: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  const [displayed, setDisplayed] = React.useState(0);
  const frameRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const duration = 800;
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(from + (value - from) * eased);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>${displayed.toFixed(2)}</span>;
};

function getBudgetColor(ratio: number): string {
  if (ratio < 0.6) return 'bg-emerald-500';
  if (ratio < 0.85) return 'bg-amber-500';
  return 'bg-red-500';
}

function getBudgetTextColor(ratio: number): string {
  if (ratio < 0.6) return 'text-emerald-500';
  if (ratio < 0.85) return 'text-amber-500';
  return 'text-red-500';
}

// ---------------------------------------------------------------------------
// CostTrackerDashboard
// ---------------------------------------------------------------------------

export const CostTrackerDashboard: React.FC<CostTrackerDashboardProps> = ({
  costs,
  budget,
  period,
  onPeriodChange,
  className,
}) => {
  const [alertThreshold, setAlertThreshold] = React.useState(80);
  const [showAlertSettings, setShowAlertSettings] = React.useState(false);
  const periods = ['7d', '30d', '90d', 'custom'];
  const maxModelCost = Math.max(...costs.costByModel.map((m) => m.cost), 1);
  const maxDailyCost = Math.max(...costs.dailyCosts.map((d) => d.cost), 1);
  const budgetRatio = budget && budget > 0 ? Math.min(costs.totalCost / budget, 1) : 0;
  const costTrend = costs.previousPeriodCost > 0
    ? ((costs.totalCost - costs.previousPeriodCost) / costs.previousPeriodCost) * 100
    : 0;
  const trendUp = costTrend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5',
        className,
      )}
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
          <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">Cost Tracker</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAlertSettings((v) => !v)}
            className="rounded-md p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
          >
            <Bell className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-0.5">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  p === period
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alert threshold settings */}
      <AnimatePresence>
        {showAlertSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-4 overflow-hidden"
          >
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))]">
                <Settings className="h-3.5 w-3.5" />
                Alert Threshold
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(parseInt(e.target.value, 10))}
                  className="h-1.5 flex-1 cursor-pointer accent-[hsl(var(--primary))]"
                />
                <span className="min-w-[3rem] text-right text-xs font-medium text-[hsl(var(--foreground))]">
                  {alertThreshold}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Total cost + trend */}
      <div className="mb-5 flex items-end gap-3">
        <AnimatedCurrency
          value={costs.totalCost}
          className="text-3xl font-bold text-[hsl(var(--foreground))]"
        />
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            'mb-1 inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
            trendUp
              ? 'bg-red-500/10 text-red-500'
              : 'bg-emerald-500/10 text-emerald-500',
          )}
        >
          {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(costTrend).toFixed(1)}%
        </motion.div>
      </div>

      {/* Budget bar */}
      {budget != null && budget > 0 && (
        <div className="mb-5">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-[hsl(var(--muted-foreground))]">Budget</span>
            <span className={cn('font-medium', getBudgetTextColor(budgetRatio))}>
              ${costs.totalCost.toFixed(2)} / ${budget.toFixed(2)}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${budgetRatio * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={cn('h-full rounded-full', getBudgetColor(budgetRatio))}
            />
          </div>
          {budgetRatio >= 0.85 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1.5 flex items-center gap-1 text-xs text-red-500"
            >
              <AlertTriangle className="h-3 w-3" />
              Approaching budget limit
            </motion.div>
          )}
        </div>
      )}

      {/* Cost by model */}
      <div className="mb-5">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))]">
          <BarChart3 className="h-3.5 w-3.5" />
          Cost by Model
        </div>
        <div className="space-y-2.5">
          {costs.costByModel.map((item, i) => (
            <div key={item.model} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[hsl(var(--foreground))]">{item.model}</span>
                <span className="font-mono text-[hsl(var(--muted-foreground))]">
                  ${item.cost.toFixed(2)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.cost / maxModelCost) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                  className="h-full rounded-full bg-[hsl(var(--primary))]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily trend */}
      <div className="mb-5">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))]">
          <Activity className="h-3.5 w-3.5" />
          Daily Trend
        </div>
        <div className="flex h-16 items-end gap-px">
          {costs.dailyCosts.map((d, i) => (
            <motion.div
              key={d.date}
              initial={{ height: 0 }}
              animate={{ height: `${(d.cost / maxDailyCost) * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.03, ease: 'easeOut' }}
              className="flex-1 rounded-t bg-[hsl(var(--primary))] opacity-70 hover:opacity-100 transition-opacity"
              title={`${d.date}: $${d.cost.toFixed(2)}`}
            />
          ))}
        </div>
      </div>

      {/* Top endpoints table */}
      <div className="mb-5">
        <h3 className="mb-2 text-xs font-medium text-[hsl(var(--muted-foreground))]">
          Top Endpoints
        </h3>
        <div className="overflow-hidden rounded-lg border border-[hsl(var(--border))]">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
                <th className="px-3 py-1.5 text-left font-medium text-[hsl(var(--muted-foreground))]">Endpoint</th>
                <th className="px-3 py-1.5 text-right font-medium text-[hsl(var(--muted-foreground))]">Calls</th>
                <th className="px-3 py-1.5 text-right font-medium text-[hsl(var(--muted-foreground))]">Cost</th>
              </tr>
            </thead>
            <tbody>
              {costs.topEndpoints.map((ep) => (
                <tr key={ep.endpoint} className="border-b border-[hsl(var(--border))] last:border-0">
                  <td className="px-3 py-1.5 font-mono text-[hsl(var(--foreground))]">{ep.endpoint}</td>
                  <td className="px-3 py-1.5 text-right text-[hsl(var(--muted-foreground))]">{ep.calls.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-right font-mono text-[hsl(var(--foreground))]">${ep.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3">
          <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
            Avg Cost / Request
          </div>
          <AnimatedCurrency
            value={costs.averageCostPerRequest}
            className="text-lg font-bold text-[hsl(var(--foreground))]"
          />
        </div>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3">
          <div className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
            Projected Monthly
            {trendUp ? <TrendingUp className="h-2.5 w-2.5 text-red-500" /> : <TrendingDown className="h-2.5 w-2.5 text-emerald-500" />}
          </div>
          <AnimatedCurrency
            value={costs.projectedMonthlyCost}
            className="text-lg font-bold text-[hsl(var(--foreground))]"
          />
        </div>
      </div>
    </motion.div>
  );
};

CostTrackerDashboard.displayName = 'CostTrackerDashboard';
