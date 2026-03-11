'use client'

import React, { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Circle, Pentagon, MapPin, Ruler, Tag } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface GeofenceCenter {
  lat: number
  lng: number
}

export interface GeofenceEditorProps {
  center: GeofenceCenter
  radius: number
  onRadiusChange?: (radius: number) => void
  shape?: 'circle' | 'polygon'
  onShapeChange?: (shape: 'circle' | 'polygon') => void
  name: string
  onNameChange?: (name: string) => void
  className?: string
}

const GeofenceEditor: React.FC<GeofenceEditorProps> = ({
  center,
  radius,
  onRadiusChange,
  shape = 'circle',
  onShapeChange,
  name,
  onNameChange,
  className,
}) => {
  const handleRadiusSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onRadiusChange?.(Number(e.target.value))
    },
    [onRadiusChange],
  )

  const radiusPercent = Math.min((radius / 5000) * 100, 100)

  return (
    <div
      className={cn(
        'rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden',
        className,
      )}
    >
      <div className="border-b border-[hsl(var(--border))] px-4 py-3">
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Geofence Editor</h3>
        <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
          Define a geographic zone boundary
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--foreground))] mb-2">
            <Tag className="h-3.5 w-3.5" />
            Zone Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange?.(e.target.value)}
            placeholder="Enter zone name..."
            className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] transition-colors"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--foreground))] mb-2">
            Shape
          </label>
          <div className="flex gap-2">
            {(['circle', 'polygon'] as const).map((s) => {
              const isActive = shape === s
              const Icon = s === 'circle' ? Circle : Pentagon
              return (
                <motion.button
                  key={s}
                  onClick={() => onShapeChange?.(s)}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'relative flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-xs font-medium transition-colors',
                    isActive
                      ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
                      : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]',
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        layoutId="geofence-shape-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 rounded-md bg-[hsl(var(--primary))]/10"
                      />
                    )}
                  </AnimatePresence>
                  <Icon className="relative h-4 w-4" />
                  <span className="relative capitalize">{s}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--foreground))]">
              <Ruler className="h-3.5 w-3.5" />
              Radius
            </label>
            <motion.span
              key={radius}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold text-[hsl(var(--primary))]"
            >
              {radius >= 1000 ? `${(radius / 1000).toFixed(1)} km` : `${radius} m`}
            </motion.span>
          </div>
          <div className="relative">
            <input
              type="range"
              min={50}
              max={5000}
              step={50}
              value={radius}
              onChange={handleRadiusSlider}
              className="w-full h-2 appearance-none rounded-full bg-[hsl(var(--muted))] outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[hsl(var(--primary))]"
            />
            <div className="flex justify-between mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">
              <span>50m</span>
              <span>5km</span>
            </div>
          </div>
        </div>

        <div className="relative h-32 rounded-md bg-[hsl(var(--muted))] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {shape === 'circle' ? (
              <motion.div
                key="circle"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="absolute rounded-full border-2 border-dashed border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10"
                style={{
                  width: `${Math.max(20, radiusPercent)}%`,
                  height: `${Math.max(20, radiusPercent)}%`,
                }}
              />
            ) : (
              <motion.div
                key="polygon"
                initial={{ scale: 0, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="absolute border-2 border-dashed border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10"
                style={{
                  width: `${Math.max(20, radiusPercent * 0.8)}%`,
                  height: `${Math.max(20, radiusPercent * 0.8)}%`,
                  clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                }}
              />
            )}
          </AnimatePresence>
          <MapPin className="relative h-5 w-5 text-[hsl(var(--primary))] fill-[hsl(var(--primary))]" />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
          <MapPin className="h-3 w-3" />
          <span>
            Center: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  )
}

GeofenceEditor.displayName = 'GeofenceEditor'

export { GeofenceEditor }
