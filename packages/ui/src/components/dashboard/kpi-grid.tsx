'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { KpiStatCard, type KpiStatCardProps } from './kpi-stat-card';

// ---------------------------------------------------------------------------
// KpiGrid
// ---------------------------------------------------------------------------

export interface KpiGridProps {
  cards: KpiStatCardProps[];
  columns?: 2 | 3 | 4 | 'auto';
  loading?: boolean;
  className?: string;
}

const columnClasses: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
  auto: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.075,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const KpiGrid: React.FC<KpiGridProps> = ({
  cards = [],
  columns = 'auto',
  loading = false,
  className,
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'grid grid-cols-1 gap-4',
        columnClasses[String(columns)],
        className,
      )}
    >
      {cards.map((card, index) => (
        <motion.div key={index} variants={itemVariants}>
          <KpiStatCard
            {...card}
            loading={loading || card.loading}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

KpiGrid.displayName = 'KpiGrid';
