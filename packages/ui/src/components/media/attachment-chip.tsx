'use client'

import React, { useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  File,
  X,
  Download,
  Archive,
} from 'lucide-react'
import { cn } from '../../lib/utils'

// ---- Types ----

export interface AttachmentChipProps {
  fileName: string
  fileSize: string
  fileType: string
  onRemove?: () => void
  onDownload?: () => void
  className?: string
}

// ---- Component ----

const FILE_TYPE_MAP: Record<string, { icon: React.ReactNode; bg: string }> = {
  pdf: {
    icon: <FileText className="h-3.5 w-3.5" />,
    bg: 'bg-red-500/10 text-red-600',
  },
  doc: {
    icon: <FileText className="h-3.5 w-3.5" />,
    bg: 'bg-blue-500/10 text-blue-600',
  },
  docx: {
    icon: <FileText className="h-3.5 w-3.5" />,
    bg: 'bg-blue-500/10 text-blue-600',
  },
  png: {
    icon: <FileImage className="h-3.5 w-3.5" />,
    bg: 'bg-emerald-500/10 text-emerald-600',
  },
  jpg: {
    icon: <FileImage className="h-3.5 w-3.5" />,
    bg: 'bg-emerald-500/10 text-emerald-600',
  },
  jpeg: {
    icon: <FileImage className="h-3.5 w-3.5" />,
    bg: 'bg-emerald-500/10 text-emerald-600',
  },
  gif: {
    icon: <FileImage className="h-3.5 w-3.5" />,
    bg: 'bg-emerald-500/10 text-emerald-600',
  },
  svg: {
    icon: <FileImage className="h-3.5 w-3.5" />,
    bg: 'bg-violet-500/10 text-violet-600',
  },
  mp4: {
    icon: <FileVideo className="h-3.5 w-3.5" />,
    bg: 'bg-amber-500/10 text-amber-600',
  },
  webm: {
    icon: <FileVideo className="h-3.5 w-3.5" />,
    bg: 'bg-amber-500/10 text-amber-600',
  },
  mp3: {
    icon: <FileAudio className="h-3.5 w-3.5" />,
    bg: 'bg-pink-500/10 text-pink-600',
  },
  wav: {
    icon: <FileAudio className="h-3.5 w-3.5" />,
    bg: 'bg-pink-500/10 text-pink-600',
  },
  zip: {
    icon: <Archive className="h-3.5 w-3.5" />,
    bg: 'bg-orange-500/10 text-orange-600',
  },
  rar: {
    icon: <Archive className="h-3.5 w-3.5" />,
    bg: 'bg-orange-500/10 text-orange-600',
  },
}

const DEFAULT_FILE_TYPE = {
  icon: <File className="h-3.5 w-3.5" />,
  bg: 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
}

export const AttachmentChip: React.FC<AttachmentChipProps> = ({
  fileName,
  fileSize,
  fileType,
  onRemove,
  onDownload,
  className,
}) => {
  const [isVisible, setIsVisible] = React.useState(true)

  const typeInfo = useMemo(() => {
    const ext = fileType.toLowerCase().replace('.', '')
    return FILE_TYPE_MAP[ext] || DEFAULT_FILE_TYPE
  }, [fileType])

  const truncatedName = useMemo(() => {
    if (fileName.length <= 24) return fileName
    const ext = fileName.split('.').pop()
    const base = fileName.slice(0, fileName.length - (ext ? ext.length + 1 : 0))
    const truncated = base.slice(0, 18)
    return `${truncated}...${ext ? `.${ext}` : ''}`
  }, [fileName])

  const handleRemove = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => onRemove?.(), 200)
  }, [onRemove])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-1.5 pl-2 pr-1.5',
            className,
          )}
        >
          <div className={cn('flex h-6 w-6 items-center justify-center rounded-full', typeInfo.bg)}>
            {typeInfo.icon}
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className="max-w-[160px] truncate text-sm font-medium text-[hsl(var(--card-foreground))]"
              title={fileName}
            >
              {truncatedName}
            </span>
            <span className="text-xs text-[hsl(var(--muted-foreground))]">{fileSize}</span>
          </div>

          <div className="flex items-center gap-0.5">
            {onDownload && (
              <button
                onClick={onDownload}
                className="rounded-full p-1 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--card-foreground))]"
                aria-label="Download file"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            )}
            {onRemove && (
              <button
                onClick={handleRemove}
                className="rounded-full p-1 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-red-500/10 hover:text-red-500"
                aria-label="Remove attachment"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

AttachmentChip.displayName = 'AttachmentChip'
