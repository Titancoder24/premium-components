'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame, Droplets, Palette, Eye, EyeOff } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface HeatmapDataPoint {
  x: number
  y: number
  intensity: number
}

export interface HeatmapOverlayProps {
  data: HeatmapDataPoint[]
  colorScale?: 'warm' | 'cool' | 'viridis'
  opacity?: number
  showLegend?: boolean
  className?: string
}

const colorScales = {
  warm: {
    label: 'Warm',
    icon: Flame,
    stops: ['hsl(60, 100%, 85%)', 'hsl(40, 100%, 60%)', 'hsl(20, 100%, 50%)', 'hsl(0, 85%, 45%)'],
    colors: (intensity: number) => {
      if (intensity < 0.25) return 'bg-yellow-200'
      if (intensity < 0.5) return 'bg-orange-300'
      if (intensity < 0.75) return 'bg-orange-500'
      return 'bg-red-600'
    },
  },
  cool: {
    label: 'Cool',
    icon: Droplets,
    stops: ['hsl(200, 80%, 90%)', 'hsl(210, 80%, 65%)', 'hsl(230, 70%, 50%)', 'hsl(250, 80%, 35%)'],
    colors: (intensity: number) => {
      if (intensity < 0.25) return 'bg-sky-200'
      if (intensity < 0.5) return 'bg-blue-400'
      if (intensity < 0.75) return 'bg-blue-600'
      return 'bg-indigo-700'
    },
  },
  viridis: {
    label: 'Viridis',
    icon: Palette,
    stops: ['hsl(70, 80%, 70%)', 'hsl(130, 60%, 50%)', 'hsl(230, 60%, 45%)', 'hsl(280, 80%, 30%)'],
    colors: (intensity: number) => {
      if (intensity < 0.25) return 'bg-lime-300'
      if (intensity < 0.5) return 'bg-emerald-500'
      if (intensity < 0.75) return 'bg-blue-600'
      return 'bg-purple-800'
    },
  },
}

const GRID_SIZE = 10

const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({
  data,
  colorScale = 'warm',
  opacity = 0.8,
  showLegend = true,
  className,
}) => {
  const scale = colorScales[colorScale]
  const ScaleIcon = scale.icon

  const grid = useMemo(() => {
    const cells: { row: number; col: number; intensity: number }[] = []
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        let totalIntensity = 0
        for (const point of data) {
          const dx = (point.x / 100) * GRID_SIZE - col
          const dy = (point.y / 100) * GRID_SIZE - row
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 3) {
            totalIntensity += point.intensity * Math.max(0, 1 - dist / 3)
          }
        }
        cells.push({ row, col, intensity: Math.min(1, totalIntensity) })
      }
    }
    return cells
  }, [data])

  const legendLabels = ['Low', 'Medium', 'High', 'Very High']

  return (
    <div
      className={cn(
        'rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Heatmap</h3>
          <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
            {data.length} data point{data.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <ScaleIcon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <span className="text-xs font-medium text-[hsl(var(--muted-foreground))] capitalize">
            {scale.label}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div
          className="grid gap-0.5 rounded-md overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            opacity,
          }}
        >
          {grid.map((cell, index) => (
            <motion.div
              key={`${cell.row}-${cell.col}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: (cell.row * GRID_SIZE + cell.col) * 0.008,
                duration: 0.3,
              }}
              className={cn(
                'aspect-square rounded-sm transition-colors',
                cell.intensity > 0.02
                  ? scale.colors(cell.intensity)
                  : 'bg-[hsl(var(--muted))]',
              )}
              style={{
                opacity: cell.intensity > 0.02 ? Math.max(0.3, cell.intensity) : 0.4,
              }}
              title={`(${cell.col}, ${cell.row}): ${(cell.intensity * 100).toFixed(0)}%`}
            />
          ))}
        </div>

        {showLegend && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-3 flex items-center gap-2"
          >
            <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Low</span>
            <div className="flex flex-1 h-2 rounded-full overflow-hidden">
              {scale.stops.map((stop, i) => (
                <div
                  key={i}
                  className="flex-1"
                  style={{ backgroundColor: stop }}
                />
              ))}
            </div>
            <span className="text-[10px] text-[hsl(var(--muted-foreground))]">High</span>
          </motion.div>
        )}

        <div className="mt-2 flex items-center justify-between text-[10px] text-[hsl(var(--muted-foreground))]">
          <span>Opacity: {Math.round(opacity * 100)}%</span>
          <div className="flex items-center gap-1">
            {opacity > 0 ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
            <span>{showLegend ? 'Legend on' : 'Legend off'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

HeatmapOverlay.displayName = 'HeatmapOverlay'

export { HeatmapOverlay }
