'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  CreditCard,
  Download,
  FileText,
  Calendar,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BillingPeriod {
  startDate: string;
  endDate: string;
  label?: string;
}

export interface UsageMetric {
  id: string;
  label: string;
  current: number;
  limit: number;
  unit: string;
  costPerUnit?: number;
}

export interface Invoice {
  id: string;
  date: string;
  total: number;
  dueDate?: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface PaymentMethod {
  type: 'visa' | 'mastercard' | 'amex' | 'card';
  last4: string;
  expiry: string;
}

export interface HistoricalUsage {
  label: string;
  value: number;
}

export interface UsageBillingDashboardProps {
  period: BillingPeriod;
  usageMetrics: UsageMetric[];
  invoices?: Invoice[];
  paymentMethod?: PaymentMethod;
  historicalUsage?: HistoricalUsage[];
  onDownloadInvoice?: (invoiceId: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Animated Counter
// ---------------------------------------------------------------------------

function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const duration = 800;
    const startTime = Date.now();
    const startVal = display;
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(startVal + (value - startVal) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{formatCurrency(display)}</>;
}

// ---------------------------------------------------------------------------
// UsageMeter
// ---------------------------------------------------------------------------

function UsageMeter({ metric, index }: { metric: UsageMetric; index: number }) {
  const pct = Math.min((metric.current / metric.limit) * 100, 100);
  const isNearLimit = pct >= 80;
  const isOver = pct >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{metric.label}</span>
        <span className="text-muted-foreground">
          {metric.current.toLocaleString()} / {metric.limit.toLocaleString()}{' '}
          {metric.unit}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.2 + index * 0.08, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            isOver
              ? 'bg-destructive'
              : isNearLimit
                ? 'bg-amber-500'
                : 'bg-primary',
          )}
        />
      </div>
      {metric.costPerUnit != null && (
        <p className="text-xs text-muted-foreground">
          Cost: {formatCurrency(metric.current * metric.costPerUnit)}
          {isOver && (
            <span className="ml-1 text-destructive">
              (overage applies)
            </span>
          )}
        </p>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Mini Bar Chart
// ---------------------------------------------------------------------------

function MiniBarChart({ data }: { data: HistoricalUsage[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const [hovered, setHovered] = React.useState<number | null>(null);

  return (
    <div className="flex items-end gap-1.5" style={{ height: 80 }}>
      {data.map((item, i) => {
        const h = (item.value / max) * 100;
        return (
          <div
            key={item.label}
            className="relative flex flex-1 flex-col items-center"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <AnimatePresence>
              {hovered === i && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute -top-8 whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 text-[10px] font-medium text-background shadow"
                >
                  {item.value.toLocaleString()}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={cn(
                'w-full min-h-[2px] rounded-t transition-colors',
                hovered === i ? 'bg-primary' : 'bg-primary/40',
              )}
            />
            <span className="mt-1 truncate w-full text-center text-[9px] text-muted-foreground">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// UsageBillingDashboard
// ---------------------------------------------------------------------------

export function UsageBillingDashboard({
  period,
  usageMetrics,
  invoices,
  paymentMethod,
  historicalUsage,
  onDownloadInvoice,
  className,
}: UsageBillingDashboardProps) {
  const hasOverage = usageMetrics.some(
    (m) => m.current / m.limit >= 0.8,
  );
  const totalCost = usageMetrics.reduce(
    (sum, m) => sum + (m.costPerUnit ? m.current * m.costPerUnit : 0),
    0,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('w-full space-y-6', className)}
    >
      {/* Period header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {period.label ?? 'Billing Dashboard'}
          </h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(period.startDate)} &ndash; {formatDate(period.endDate)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Estimated total</p>
          <p className="text-2xl font-bold text-foreground">
            <AnimatedCounter value={totalCost} />
          </p>
        </div>
      </div>

      {/* Overage warning banner */}
      <AnimatePresence>
        {hasOverage && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex items-center gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
              You are approaching your usage limit on one or more metrics.
              Overage charges may apply.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Usage meters */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Usage This Period
        </h3>
        <div className="space-y-5">
          {usageMetrics.map((metric, i) => (
            <UsageMeter key={metric.id} metric={metric} index={i} />
          ))}
        </div>
      </div>

      {/* Historical usage chart */}
      {historicalUsage && historicalUsage.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Historical Usage
          </h3>
          <MiniBarChart data={historicalUsage} />
        </motion.div>
      )}

      {/* Cost breakdown & invoice preview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Cost breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Cost Breakdown
          </h3>
          <table className="w-full text-sm">
            <tbody>
              {usageMetrics
                .filter((m) => m.costPerUnit != null)
                .map((m, i) => (
                  <motion.tr
                    key={m.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-2 text-muted-foreground">{m.label}</td>
                    <td className="py-2 text-right font-medium text-foreground">
                      <AnimatedCounter
                        value={m.current * (m.costPerUnit ?? 0)}
                      />
                    </td>
                  </motion.tr>
                ))}
              <tr className="font-semibold">
                <td className="pt-3 text-foreground">Total</td>
                <td className="pt-3 text-right text-foreground">
                  <AnimatedCounter value={totalCost} />
                </td>
              </tr>
            </tbody>
          </table>
        </motion.div>

        {/* Invoice preview */}
        {invoices && invoices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText className="h-4 w-4" />
              Recent Invoices
            </h3>
            <div className="space-y-2">
              {invoices.slice(0, 3).map((inv, i) => (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {formatCurrency(inv.total)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(inv.date)}
                      {inv.dueDate && ` \u00b7 Due ${formatDate(inv.dueDate)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        inv.status === 'paid' &&
                          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                        inv.status === 'pending' &&
                          'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                        inv.status === 'overdue' &&
                          'bg-destructive/10 text-destructive',
                      )}
                    >
                      {inv.status}
                    </span>
                    {onDownloadInvoice && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDownloadInvoice(inv.id)}
                        className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Payment method */}
      {paymentMethod && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {paymentMethod.type.charAt(0).toUpperCase() +
                paymentMethod.type.slice(1)}{' '}
              ending in {paymentMethod.last4}
            </p>
            <p className="text-xs text-muted-foreground">
              Expires {paymentMethod.expiry}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

UsageBillingDashboard.displayName = 'UsageBillingDashboard';
