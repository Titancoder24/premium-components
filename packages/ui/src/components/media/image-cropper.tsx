'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crop, RotateCcw, Check, X } from 'lucide-react'
import { cn } from '../../lib/utils'

// ---- Types ----

export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export interface ImageCropperProps {
  src: string
  aspectRatio?: '1:1' | '16:9' | '4:3' | 'free'
  onCrop?: (area: CropArea) => void
  className?: string
}

// ---- Component ----

const ASPECT_RATIOS: Record<string, number | null> = {
  '1:1': 1,
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  free: null,
}

const RATIO_OPTIONS = ['1:1', '16:9', '4:3', 'free'] as const

export const ImageCropper: React.FC<ImageCropperProps> = ({
  src,
  aspectRatio = 'free',
  onCrop,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeRatio, setActiveRatio] = useState(aspectRatio)
  const [isDragging, setIsDragging] = useState(false)
  const [cropArea, setCropArea] = useState<CropArea>({ x: 10, y: 10, width: 80, height: 80 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const ratio = ASPECT_RATIOS[activeRatio]
    if (ratio) {
      setCropArea((prev) => {
        const newHeight = prev.width / ratio
        return { ...prev, height: Math.min(newHeight, 90) }
      })
    }
  }, [activeRatio])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setIsDragging(true)
      setDragStart({
        x: ((e.clientX - rect.left) / rect.width) * 100 - cropArea.x,
        y: ((e.clientY - rect.top) / rect.height) * 100 - cropArea.y,
      })
    },
    [cropArea],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const px = ((e.clientX - rect.left) / rect.width) * 100
      const py = ((e.clientY - rect.top) / rect.height) * 100
      setCropArea((prev) => ({
        ...prev,
        x: Math.max(0, Math.min(100 - prev.width, px - dragStart.x)),
        y: Math.max(0, Math.min(100 - prev.height, py - dragStart.y)),
      }))
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  const handleConfirm = useCallback(() => {
    onCrop?.(cropArea)
  }, [onCrop, cropArea])

  const handleReset = useCallback(() => {
    setCropArea({ x: 10, y: 10, width: 80, height: 80 })
    setActiveRatio(aspectRatio)
  }, [aspectRatio])

  return (
    <div className={cn('flex flex-col gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--card-foreground))]">
          <Crop className="h-4 w-4" />
          <span>Crop Image</span>
        </div>
        <div className="flex gap-1">
          {RATIO_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRatio(r)}
              className={cn(
                'rounded-md px-2 py-1 text-xs font-medium transition-colors',
                activeRatio === r
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                  : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative aspect-video w-full cursor-crosshair overflow-hidden rounded-lg bg-[hsl(var(--muted))]"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img src={src} alt="Crop target" className="h-full w-full object-cover" />

        <div className="absolute inset-0 bg-black/40" />

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute border-2 border-white shadow-lg"
            style={{
              left: `${cropArea.x}%`,
              top: `${cropArea.y}%`,
              width: `${cropArea.width}%`,
              height: `${cropArea.height}%`,
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-0 bg-transparent" />
            <div className="absolute -left-1 -top-1 h-3 w-3 border-l-2 border-t-2 border-white" />
            <div className="absolute -right-1 -top-1 h-3 w-3 border-r-2 border-t-2 border-white" />
            <div className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-white" />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-white" />
            <div className="absolute left-1/3 top-0 h-full w-px bg-white/30" />
            <div className="absolute left-2/3 top-0 h-full w-px bg-white/30" />
            <div className="absolute left-0 top-1/3 h-px w-full bg-white/30" />
            <div className="absolute left-0 top-2/3 h-px w-full bg-white/30" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-[hsl(var(--muted-foreground))]">
          {Math.round(cropArea.width)}% x {Math.round(cropArea.height)}%
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 rounded-md bg-[hsl(var(--muted))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--accent))]"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-1 rounded-md bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--primary-foreground))] transition-colors hover:opacity-90"
          >
            <Check className="h-3 w-3" />
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

ImageCropper.displayName = 'ImageCropper'
