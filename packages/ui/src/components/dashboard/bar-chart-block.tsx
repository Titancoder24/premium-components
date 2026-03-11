'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BarChartDataItem {
  category: string;
  value: number;
}

export interface BarChartBlockProps {
  data: BarChartDataItem[];
  orientation?: 'vertical' | 'horizontal';
  loading?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Colors – cycles through a predefined palette
// ---------------------------------------------------------------------------

const PALETTE = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2, 220 70% 55%))',
  'hsl(var(--chart-3, 150 60% 45%))',
  'hsl(var(--chart-4, 30 80% 55%))',
  'hsl(var(--chart-5, 280 65% 55%))',
];

// ---------------------------------------------------------------------------
// BarChartBlock
// ---------------------------------------------------------------------------

export const BarChartBlock: React.FC<BarChartBlockProps> = ({
  data,
  orientation = 'vertical',
  loading = false,
  className,
}) => {
  const isHorizontal = orientation === 'horizontal';

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
        <div className="flex h-64 items-end gap-2 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-muted"
              style={{ height: `${20 + Math.random() * 70}%` }}
            />
          ))}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            layout={isHorizontal ? 'vertical' : 'horizontal'}
            margin={{ top: 4, right: 4, bottom: 0, left: isHorizontal ? 40 : -12 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            {isHorizontal ? (
              <>
                <XAxis type="number" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  width={80}
                />
              </>
            ) : (
              <>
                <XAxis dataKey="category" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
              </>
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={PALETTE[idx % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

BarChartBlock.displayName = 'BarChartBlock';
