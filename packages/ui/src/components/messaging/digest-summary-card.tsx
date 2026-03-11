'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  Tag,
} from 'lucide-react'
import { cn } from '../../lib/utils'

export interface DigestItem {
  title: string
  summary: string
  category: string
}

export interface DigestSummaryCardProps {
  period: 'daily' | 'weekly'
  date: string
  items: DigestItem[]
  totalCount: number
  className?: string
}

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
}

const itemStagger = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.25, ease: 'easeOut' },
  }),
}

const categoryColors: Record<string, string> = {
  updates: 'bg-blue-100 text-blue-700',
  alerts: 'bg-red-100 text-red-700',
  marketing: 'bg-purple-100 text-purple-700',
  social: 'bg-green-100 text-green-700',
}

export const DigestSummaryCard: React.FC<DigestSummaryCardProps> = ({
  period,
  date,
  items,
  totalCount,
  className,
}) => {
  const [expanded, setExpanded] = useState(false)
  const visibleItems = expanded ? items : items.slice(0, 3)
  const hiddenCount = items.length - 3

  const categoryMap = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {})

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={cn(
        'w-full max-w-md rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lg overflow-hidden',
        className,
      )}
    >
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[hsl(var(--primary)/0.1)]">
              <CalendarDays className="h-4 w-4 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[hsl(var(--card-foreground))]">
                {period === 'daily' ? 'Daily' : 'Weekly'} Digest
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                <Clock className="h-3 w-3" />
                {date}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[hsl(var(--primary)/0.1)]">
            <FileText className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
            <span className="text-xs font-semibold text-[hsl(var(--primary))]">
              {totalCount}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 px-5 pb-3">
        {Object.entries(categoryMap).map(([cat, count]) => (
          <span
            key={cat}
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
              categoryColors[cat.toLowerCase()] ||
                'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
            )}
          >
            <Tag className="h-2.5 w-2.5" />
            {cat} ({count})
          </span>
        ))}
      </div>

      <div className="border-t border-[hsl(var(--border))]">
        <AnimatePresence initial={false}>
          {visibleItems.map((item, i) => (
            <motion.div
              key={`${item.title}-${i}`}
              custom={i}
              variants={itemStagger}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, height: 0, transition: { duration: 0.15 } }}
              className="px-5 py-3 border-b border-[hsl(var(--border))] last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-[hsl(var(--card-foreground))] truncate">
                      {item.title}
                    </p>
                    <span
                      className={cn(
                        'inline-block px-1.5 py-0.5 text-[9px] rounded font-medium flex-shrink-0',
                        categoryColors[item.category.toLowerCase()] ||
                          'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
                      )}
                    >
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {items.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs font-medium text-[hsl(var(--primary))] bg-[hsl(var(--muted)/0.2)] hover:bg-[hsl(var(--muted)/0.4)] transition-colors border-t border-[hsl(var(--border))]"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Show {hiddenCount} more item{hiddenCount !== 1 ? 's' : ''}{' '}
              <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      )}

      {totalCount > items.length && (
        <div className="px-5 py-2.5 bg-[hsl(var(--muted)/0.15)] border-t border-[hsl(var(--border))]">
          <p className="text-[11px] text-center text-[hsl(var(--muted-foreground))]">
            Showing {items.length} of {totalCount} items in this digest
          </p>
        </div>
      )}
    </motion.div>
  )
}

DigestSummaryCard.displayName = 'DigestSummaryCard'
