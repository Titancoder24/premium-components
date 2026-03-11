'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DonutDataItem {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartBlockProps {
  data: DonutDataItem[];
  centerLabel?: string;
  centerValue?: string | number;
  loading?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Default palette
// ---------------------------------------------------------------------------

const DEFAULT_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2, 220 70% 55%))',
  'hsl(var(--chart-3, 150 60% 45%))',
  'hsl(var(--chart-4, 30 80% 55%))',
  'hsl(var(--chart-5, 280 65% 55%))',
  'hsl(var(--chart-6, 340 75% 55%))',
];

// ---------------------------------------------------------------------------
// DonutChartBlock
// ---------------------------------------------------------------------------

export const DonutChartBlock: React.FC<DonutChartBlockProps> = ({
  data,
  centerLabel,
  centerValue,
  loading = false,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'rounded-xl border border-border bg-card p-5',
        className,
      )}
    >
      {loading ? (
        <div className="flex h-64 items-center justify-center animate-pulse">
          <div className="h-40 w-40 rounded-full border-8 border-muted" />
        </div>
      ) : (
        <div className="relative">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="85%"
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label overlay */}
          {(centerLabel || centerValue !== undefined) && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              {centerValue !== undefined && (
                <span className="text-2xl font-bold text-foreground">
                  {centerValue}
                </span>
              )}
              {centerLabel && (
                <span className="text-xs text-muted-foreground">
                  {centerLabel}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

DonutChartBlock.displayName = 'DonutChartBlock';
