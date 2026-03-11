'use client'

import React, { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  FileText,
  Printer,
} from 'lucide-react'
import { cn } from '../../lib/utils'

// ---- Types ----

export interface DocumentViewerProps {
  title?: string
  pages: number
  currentPage: number
  onPageChange?: (page: number) => void
  zoom?: number
  onZoomChange?: (zoom: number) => void
  className?: string
}

// ---- Component ----

const ZOOM_STEPS = [50, 75, 100, 125, 150, 200]

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  title = 'Document',
  pages,
  currentPage,
  onPageChange,
  zoom = 100,
  onZoomChange,
  className,
}) => {
  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(pages, page))
      onPageChange?.(clamped)
    },
    [pages, onPageChange],
  )

  const adjustZoom = useCallback(
    (direction: 'in' | 'out') => {
      const idx = ZOOM_STEPS.indexOf(zoom)
      const current = idx >= 0 ? idx : ZOOM_STEPS.findIndex((s) => s >= zoom)
      const next = direction === 'in' ? Math.min(ZOOM_STEPS.length - 1, current + 1) : Math.max(0, current - 1)
      onZoomChange?.(ZOOM_STEPS[next]!)
    },
    [zoom, onZoomChange],
  )

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 shrink-0 text-[hsl(var(--primary))]" />
          <span className="truncate text-sm font-medium text-[hsl(var(--card-foreground))]">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => adjustZoom('out')}
            disabled={zoom <= ZOOM_STEPS[0]!}
            className="rounded-md p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] disabled:opacity-40"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-xs tabular-nums text-[hsl(var(--muted-foreground))]">
            {zoom}%
          </span>
          <button
            onClick={() => adjustZoom('in')}
            disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]!}
            className="rounded-md p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] disabled:opacity-40"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <div className="mx-1 h-4 w-px bg-[hsl(var(--border))]" />
          <button className="rounded-md p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]">
            <RotateCw className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]">
            <Printer className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-auto bg-[hsl(var(--muted))]/50 p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="mx-auto rounded-sm bg-white shadow-lg"
            style={{
              width: `${(595 * zoom) / 100}px`,
              minHeight: `${(842 * zoom) / 100}px`,
              maxWidth: '100%',
            }}
          >
            <div className="flex h-full flex-col items-center justify-center p-12">
              <div className="mb-6 space-y-3 w-full">
                <div className="h-4 w-3/4 rounded bg-[hsl(var(--muted))]" />
                <div className="h-3 w-full rounded bg-[hsl(var(--muted))]" />
                <div className="h-3 w-full rounded bg-[hsl(var(--muted))]" />
                <div className="h-3 w-5/6 rounded bg-[hsl(var(--muted))]" />
              </div>
              <div className="mb-6 space-y-3 w-full">
                <div className="h-3 w-full rounded bg-[hsl(var(--muted))]" />
                <div className="h-3 w-full rounded bg-[hsl(var(--muted))]" />
                <div className="h-3 w-2/3 rounded bg-[hsl(var(--muted))]" />
              </div>
              <div className="h-32 w-full rounded-lg bg-[hsl(var(--muted))]/60" />
              <div className="mt-6 space-y-3 w-full">
                <div className="h-3 w-full rounded bg-[hsl(var(--muted))]" />
                <div className="h-3 w-4/5 rounded bg-[hsl(var(--muted))]" />
                <div className="h-3 w-full rounded bg-[hsl(var(--muted))]" />
              </div>
              <p className="mt-auto pt-8 text-xs text-[hsl(var(--muted-foreground))]">
                Page {currentPage} of {pages}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-3 border-t border-[hsl(var(--border))] px-4 py-2.5">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-md p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-1.5 text-sm">
          <input
            type="number"
            min={1}
            max={pages}
            value={currentPage}
            onChange={(e) => goToPage(parseInt(e.target.value, 10) || 1)}
            className="w-12 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1 text-center text-xs text-[hsl(var(--card-foreground))] outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
          />
          <span className="text-xs text-[hsl(var(--muted-foreground))]">of {pages}</span>
        </div>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= pages}
          className="rounded-md p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

DocumentViewer.displayName = 'DocumentViewer'
