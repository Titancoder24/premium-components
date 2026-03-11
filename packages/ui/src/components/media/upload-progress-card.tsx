'use client'

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw,
  FileIcon,
  Loader2,
} from 'lucide-react'
import { cn } from '../../lib/utils'

// ---- Types ----

export interface UploadFile {
  name: string
  size: string
  progress: number
  status: 'uploading' | 'complete' | 'error'
}

export interface UploadProgressCardProps {
  files: UploadFile[]
  onCancel?: (fileName: string) => void
  onRetry?: (fileName: string) => void
  className?: string
}

// ---- Component ----

function getStatusIcon(status: UploadFile['status']) {
  switch (status) {
    case 'complete':
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Loader2 className="h-4 w-4 animate-spin text-[hsl(var(--primary))]" />
  }
}

function getStatusColor(status: UploadFile['status']): string {
  switch (status) {
    case 'complete':
      return 'bg-emerald-500'
    case 'error':
      return 'bg-red-500'
    default:
      return 'bg-[hsl(var(--primary))]'
  }
}

export const UploadProgressCard: React.FC<UploadProgressCardProps> = ({
  files,
  onCancel,
  onRetry,
  className,
}) => {
  const summary = useMemo(() => {
    const uploading = files.filter((f) => f.status === 'uploading').length
    const complete = files.filter((f) => f.status === 'complete').length
    const errors = files.filter((f) => f.status === 'error').length
    return { uploading, complete, errors }
  }, [files])

  const overallProgress = useMemo(() => {
    if (files.length === 0) return 0
    return Math.round(files.reduce((sum, f) => sum + f.progress, 0) / files.length)
  }, [files])

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-3">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4 text-[hsl(var(--primary))]" />
          <span className="text-sm font-semibold text-[hsl(var(--card-foreground))]">
            Uploading Files
          </span>
        </div>
        <span className="text-xs tabular-nums text-[hsl(var(--muted-foreground))]">
          {overallProgress}% overall
        </span>
      </div>

      <div className="px-4 py-2">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
          <motion.div
            className="h-full rounded-full bg-[hsl(var(--primary))]"
            initial={{ width: '0%' }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto px-2 py-1">
        <AnimatePresence>
          {files.map((file) => (
            <motion.div
              key={file.name}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-b border-[hsl(var(--border))] last:border-0"
            >
              <div className="flex items-center gap-3 px-2 py-2.5">
                <FileIcon className="h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm text-[hsl(var(--card-foreground))]">
                      {file.name}
                    </span>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {getStatusIcon(file.status)}
                      {file.status === 'uploading' && (
                        <button
                          onClick={() => onCancel?.(file.name)}
                          className="rounded p-0.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {file.status === 'error' && (
                        <button
                          onClick={() => onRetry?.(file.name)}
                          className="rounded p-0.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                      <motion.div
                        className={cn('h-full rounded-full', getStatusColor(file.status))}
                        initial={{ width: '0%' }}
                        animate={{ width: `${file.progress}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="w-16 text-right text-xs tabular-nums text-[hsl(var(--muted-foreground))]">
                      {file.status === 'error' ? 'Failed' : `${file.progress}%`}
                    </span>
                  </div>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">{file.size}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4 border-t border-[hsl(var(--border))] px-4 py-2.5">
        <span className="text-xs text-[hsl(var(--muted-foreground))]">
          {summary.uploading > 0 && `${summary.uploading} uploading`}
          {summary.complete > 0 && `${summary.uploading > 0 ? ' \u2022 ' : ''}${summary.complete} complete`}
          {summary.errors > 0 && (
            <span className="text-red-500">
              {summary.uploading > 0 || summary.complete > 0 ? ' \u2022 ' : ''}{summary.errors} failed
            </span>
          )}
        </span>
      </div>
    </div>
  )
}

UploadProgressCard.displayName = 'UploadProgressCard'
