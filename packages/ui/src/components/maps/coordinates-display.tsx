'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Globe, ToggleLeft, ToggleRight, MapPin } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface CoordinatesDisplayProps {
  latitude: number
  longitude: number
  format?: 'decimal' | 'dms'
  onCopy?: (text: string) => void
  className?: string
}

function decimalToDms(decimal: number, isLatitude: boolean): string {
  const absolute = Math.abs(decimal)
  const degrees = Math.floor(absolute)
  const minutesRaw = (absolute - degrees) * 60
  const minutes = Math.floor(minutesRaw)
  const seconds = ((minutesRaw - minutes) * 60).toFixed(1)

  const direction = isLatitude
    ? decimal >= 0 ? 'N' : 'S'
    : decimal >= 0 ? 'E' : 'W'

  return `${degrees}\u00B0 ${minutes}' ${seconds}" ${direction}`
}

const CoordinatesDisplay: React.FC<CoordinatesDisplayProps> = ({
  latitude,
  longitude,
  format = 'decimal',
  onCopy,
  className,
}) => {
  const [copied, setCopied] = useState(false)
  const [activeFormat, setActiveFormat] = useState(format)

  const formattedLat = useMemo(() => {
    if (activeFormat === 'dms') return decimalToDms(latitude, true)
    return `${latitude.toFixed(6)}\u00B0`
  }, [latitude, activeFormat])

  const formattedLng = useMemo(() => {
    if (activeFormat === 'dms') return decimalToDms(longitude, false)
    return `${longitude.toFixed(6)}\u00B0`
  }, [longitude, activeFormat])

  const fullText = `${formattedLat}, ${formattedLng}`

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullText)
    } catch {
      // fallback - no clipboard API
    }
    setCopied(true)
    onCopy?.(fullText)
    setTimeout(() => setCopied(false), 2000)
  }, [fullText, onCopy])

  const toggleFormat = useCallback(() => {
    setActiveFormat((prev) => (prev === 'decimal' ? 'dms' : 'decimal'))
  }, [])

  return (
    <div
      className={cn(
        'rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-3">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-[hsl(var(--primary))]" />
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Coordinates</h3>
        </div>
        <button
          onClick={toggleFormat}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors uppercase tracking-wide"
        >
          {activeFormat === 'decimal' ? (
            <ToggleLeft className="h-3.5 w-3.5" />
          ) : (
            <ToggleRight className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
          )}
          {activeFormat}
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 shrink-0 text-[hsl(var(--primary))] fill-[hsl(var(--primary))]/20" />
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFormat}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="space-y-1"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] uppercase w-6">
                    Lat
                  </span>
                  <span className="text-sm font-mono font-semibold text-[hsl(var(--foreground))]">
                    {formattedLat}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] uppercase w-6">
                    Lng
                  </span>
                  <span className="text-sm font-mono font-semibold text-[hsl(var(--foreground))]">
                    {formattedLng}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-md bg-[hsl(var(--muted))] px-3 py-2">
          <code className="flex-1 min-w-0 truncate text-xs font-mono text-[hsl(var(--foreground))]">
            {fullText}
          </code>
          <motion.button
            onClick={handleCopy}
            whileTap={{ scale: 0.9 }}
            className="shrink-0 rounded-md p-1.5 hover:bg-[hsl(var(--background))] transition-colors"
            aria-label="Copy coordinates"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Check className="h-4 w-4 text-emerald-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -90 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Copy className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {copied && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-[10px] text-emerald-500 font-medium text-center overflow-hidden"
            >
              Copied to clipboard
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

CoordinatesDisplay.displayName = 'CoordinatesDisplay'

export { CoordinatesDisplay }
