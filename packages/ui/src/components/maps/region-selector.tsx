'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, MapPin, Building2, ChevronDown, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface RegionNode {
  name: string
  children?: RegionNode[]
}

export interface RegionValue {
  country?: string
  state?: string
  city?: string
}

export interface RegionSelectorProps {
  regions: RegionNode[]
  value?: RegionValue
  onChange?: (value: RegionValue) => void
  className?: string
}

interface DropdownProps {
  label: string
  icon: React.ReactNode
  options: string[]
  value?: string
  onChange: (value: string) => void
  onClear: () => void
  disabled?: boolean
  placeholder: string
  index: number
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  icon,
  options,
  value,
  onChange,
  onClear,
  disabled,
  placeholder,
  index,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = useCallback(
    (option: string) => {
      onChange(option)
      setIsOpen(false)
    },
    [onChange],
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
        {icon}
        {label}
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className={cn(
          'flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors',
          disabled
            ? 'border-[hsl(var(--border))] bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] cursor-not-allowed opacity-60'
            : 'border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))] cursor-pointer',
          isOpen && 'border-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary))]',
        )}
      >
        <span className={cn(!value && 'text-[hsl(var(--muted-foreground))]')}>
          {value || placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && !disabled && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="rounded-full p-0.5 hover:bg-[hsl(var(--muted))]"
              onClick={(e) => {
                e.stopPropagation()
                onClear()
                setIsOpen(false)
              }}
            >
              <X className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
            </motion.span>
          )}
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && options.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{ transformOrigin: 'top' }}
            className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lg max-h-40 overflow-y-auto py-1"
          >
            {options.map((option, i) => (
              <motion.li
                key={option}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => handleSelect(option)}
                className={cn(
                  'cursor-pointer px-3 py-1.5 text-sm transition-colors',
                  value === option
                    ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-medium'
                    : 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
                )}
              >
                {option}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
  regions,
  value = {},
  onChange,
  className,
}) => {
  const countryOptions = useMemo(() => regions.map((r) => r.name), [regions])

  const stateOptions = useMemo(() => {
    if (!value.country) return []
    const country = regions.find((r) => r.name === value.country)
    return country?.children?.map((s) => s.name) ?? []
  }, [regions, value.country])

  const cityOptions = useMemo(() => {
    if (!value.country || !value.state) return []
    const country = regions.find((r) => r.name === value.country)
    const state = country?.children?.find((s) => s.name === value.state)
    return state?.children?.map((c) => c.name) ?? []
  }, [regions, value.country, value.state])

  const handleCountryChange = useCallback(
    (country: string) => {
      onChange?.({ country, state: undefined, city: undefined })
    },
    [onChange],
  )

  const handleStateChange = useCallback(
    (state: string) => {
      onChange?.({ ...value, state, city: undefined })
    },
    [onChange, value],
  )

  const handleCityChange = useCallback(
    (city: string) => {
      onChange?.({ ...value, city })
    },
    [onChange, value],
  )

  return (
    <div
      className={cn(
        'rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden',
        className,
      )}
    >
      <div className="border-b border-[hsl(var(--border))] px-4 py-3">
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Select Region</h3>
        <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
          Choose country, state, and city
        </p>
      </div>

      <div className="p-4 space-y-3">
        <Dropdown
          label="Country"
          icon={<Globe className="h-3 w-3" />}
          options={countryOptions}
          value={value.country}
          onChange={handleCountryChange}
          onClear={() => onChange?.({})}
          placeholder="Select country..."
          index={0}
        />
        <Dropdown
          label="State / Province"
          icon={<MapPin className="h-3 w-3" />}
          options={stateOptions}
          value={value.state}
          onChange={handleStateChange}
          onClear={() => onChange?.({ country: value.country })}
          disabled={!value.country}
          placeholder={value.country ? 'Select state...' : 'Select country first'}
          index={1}
        />
        <Dropdown
          label="City"
          icon={<Building2 className="h-3 w-3" />}
          options={cityOptions}
          value={value.city}
          onChange={handleCityChange}
          onClear={() => onChange?.({ country: value.country, state: value.state })}
          disabled={!value.state}
          placeholder={value.state ? 'Select city...' : 'Select state first'}
          index={2}
        />
      </div>

      {(value.country || value.state || value.city) && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="overflow-hidden border-t border-[hsl(var(--border))]"
        >
          <div className="px-4 py-2.5 text-xs text-[hsl(var(--muted-foreground))]">
            Selected:{' '}
            <span className="font-medium text-[hsl(var(--foreground))]">
              {[value.city, value.state, value.country].filter(Boolean).join(', ')}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

RegionSelector.displayName = 'RegionSelector'

export { RegionSelector }
